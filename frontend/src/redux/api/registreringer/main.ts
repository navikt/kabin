import { formatISO } from 'date-fns';
import { CreateRegistreringParams, FinishRegistreringParams } from '@app/redux/api/registreringer/param-types';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import {
  DraftRegistrering,
  FinishedRegistrering,
  FinishingRegistrering,
  Registrering,
} from '@app/redux/api/registreringer/types';
import {
  UpdateFn,
  removeFerdigRegistrering,
  removeUferdigRegistrering,
  setRegistrering,
  setUferdigRegistrering,
  updateFerdigRegistrering,
  updateRegistrering,
} from '@app/redux/api/registreringer/updates';
import { FerdigstiltRegistreringResponse } from './response-types';

const mainSlice = registreringApi.injectEndpoints({
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
        setRegistrering(id, undefined);
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
        const now = formatISO(new Date());

        const optimisticUpdate: UpdateFn<Registrering, FinishingRegistrering | FinishedRegistrering> = (draft) => ({
          ...draft,
          typeId,
          finished: now,
          modified: now,
        });

        const patchResult = updateRegistrering(id, optimisticUpdate);
        const unfinishedPatchResult = removeUferdigRegistrering(id);
        const finishedPatchResult = updateFerdigRegistrering(id, optimisticUpdate);

        try {
          const { data } = await queryFulfilled;

          const update: UpdateFn<Registrering, FinishedRegistrering> = (draft) => ({ ...draft, typeId, ...data });

          updateRegistrering(id, update);
          removeUferdigRegistrering(id);
          updateFerdigRegistrering(id, update);
        } catch (error) {
          patchResult.undo();
          unfinishedPatchResult.undo();
          finishedPatchResult.undo();
        }
      },
    }),
  }),
});

export const { useCreateRegistreringMutation, useDeleteRegistreringMutation, useFinishRegistreringMutation } =
  mainSlice;
