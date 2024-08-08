import { IS_LOCALHOST } from '@app/redux/api/common';
import { CreateRegistreringParams, FinishRegistreringParams } from '@app/redux/api/registreringer/param-types';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { FerdigstiltRegistreringResponse } from '@app/redux/api/registreringer/response-types';
import { DraftRegistrering, FinishedRegistrering, Registrering } from '@app/redux/api/registreringer/types';
import {
  UpdateFn,
  removeFerdigRegistrering,
  removeRegistrering,
  removeUferdigRegistrering,
  setRegistrering,
  setUferdigRegistrering,
  updateFerdigRegistrering,
  updateRegistrering,
} from '@app/redux/api/registreringer/updates';

const mainSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    createRegistrering: builder.mutation<DraftRegistrering, CreateRegistreringParams>({
      query: (body) => ({
        url: '/registreringer',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        const { data } = await queryFulfilled;
        setRegistrering(data.id, data);
        setUferdigRegistrering(data);
      },
    }),

    deleteRegistrering: builder.mutation<void, string>({
      query: (id) => ({
        url: `/registreringer/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (id, { queryFulfilled }) => {
        await queryFulfilled;
        removeRegistrering(id);
        removeUferdigRegistrering(id);
        removeFerdigRegistrering(id);
      },
    }),

    finishRegistrering: builder.mutation<FerdigstiltRegistreringResponse, FinishRegistreringParams>({
      query: ({ id }) => ({
        url: `/registreringer/${id}/ferdigstill`,
        method: 'POST',
      }),
      onQueryStarted: async ({ id, typeId }, { queryFulfilled }) => {
        const { data } = await queryFulfilled;

        const update: UpdateFn<Registrering, FinishedRegistrering> = (draft) => ({ ...draft, typeId, ...data });

        updateRegistrering(id, update);
        removeUferdigRegistrering(id);
        updateFerdigRegistrering(id, update);
      },
    }),
  }),
});

export const { useCreateRegistreringMutation, useDeleteRegistreringMutation, useFinishRegistreringMutation } =
  mainSlice;
