import { formatISO } from 'date-fns';
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
    createRegistrering: builder.mutation<DraftRegistrering, void>({
      query: () => ({
        url: '/registreringer',
        method: 'POST',
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

    finishRegistrering: builder.mutation<FerdigstiltRegistreringResponse, string>({
      query: (id) => ({
        url: `/registreringer/${id}/ferdigstill`,
        method: 'POST',
      }),
      onQueryStarted: async (id, { queryFulfilled }) => {
        const now = formatISO(new Date());

        const optimisticUpdate: UpdateFn<Registrering, FinishingRegistrering | FinishedRegistrering> = (draft) => ({
          ...draft,
          finished: now,
          modified: now,
        });

        const patchResult = updateRegistrering(id, optimisticUpdate);
        const unfinishedPatchResult = removeUferdigRegistrering(id);
        const finishedPatchResult = updateFerdigRegistrering(id, optimisticUpdate);

        try {
          const { data } = await queryFulfilled;

          const update: UpdateFn<Registrering, FinishedRegistrering> = (draft) => ({ ...draft, ...data });

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
