import { IS_LOCALHOST } from '@app/redux/api/common';
import type { CreateRegistreringParams } from '@app/redux/api/registreringer/param-types';
import {
  removeFerdigRegistrering,
  removeRegistrering,
  removeUferdigRegistrering,
  setRegistrering,
  setUferdigRegistrering,
  updateFerdigRegistrering,
  updateRegistrering,
} from '@app/redux/api/registreringer/queries';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import type { FerdigstiltRegistreringResponse } from '@app/redux/api/registreringer/response-types';
import type {
  BaseRegistrering,
  DraftRegistrering,
  FinishedRegistrering,
  FinishedRegistreringListItem,
  Registrering,
} from '@app/redux/api/registreringer/types';

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

    finishRegistrering: builder.mutation<FerdigstiltRegistreringResponse, Registrering>({
      query: ({ id }) => ({
        url: `/registreringer/${id}/ferdigstill`,
        method: 'POST',
      }),
      onQueryStarted: async (draftRegistrering, { queryFulfilled }) => {
        const { data } = await queryFulfilled;

        updateRegistrering(draftRegistrering.id, (d) => {
          const finished = { ...d, ...data };

          return isFerdigRegistrering(finished) ? finished : d;
        });

        removeUferdigRegistrering(draftRegistrering.id);

        const {
          sakenGjelderValue,
          typeId,
          created,
          overstyringer: { ytelseId },
        } = draftRegistrering;

        const { behandlingId, finished, id } = data;

        const finishedRegistrering: FinishedRegistreringListItem = {
          id,
          sakenGjelderValue,
          typeId,
          ytelseId,
          created,
          finished,
          behandlingId,
        };

        updateFerdigRegistrering(finishedRegistrering);
      },
    }),
  }),
});

const isFerdigRegistrering = (registrering: BaseRegistrering): registrering is FinishedRegistrering =>
  registrering.finished !== null &&
  registrering.journalpostId !== null &&
  registrering.typeId !== null &&
  registrering.mulighet !== null &&
  registrering.behandlingId !== null;

export const { useCreateRegistreringMutation, useDeleteRegistreringMutation, useFinishRegistreringMutation } =
  mainSlice;
