import { muligheterApi } from '@app/redux/api/muligheter';
import {
  SetAnkemulisghetParams,
  SetKlagemulighetParams,
  SetTypeParams,
} from '@app/redux/api/registreringer/param-types';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import { SetMulighetResponse, SetTypeResponse } from '@app/redux/api/registreringer/response-types';
import { DraftRegistrering } from '@app/redux/api/registreringer/types';
import { updateDrafts } from '@app/redux/api/registreringer/updates';
import { SaksTypeEnum } from '@app/types/common';
import { FagsystemId } from '@app/types/mulighet';

interface SetMulighetPayload {
  mulighetId: string;
  originalFagsystemId: string;
  currentFagsystemId: FagsystemId;
}

const mutationsSlice = registreringApi.injectEndpoints({
  endpoints: (builder) => ({
    setSakenGjelder: builder.mutation<DraftRegistrering, { id: string; sakenGjelderValue: string }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/saken-gjelder-value`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, sakenGjelderValue }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, sakenGjelderValue }));

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, () => data);
        } catch (error) {
          undo();
        }
      },
    }),

    setJournalpostId: builder.mutation<DraftRegistrering, { id: string; journalpostId: string | null }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/journalpost-id`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, journalpostId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, journalpostId }));

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, () => data);
        } catch (error) {
          undo();
        }
      },
    }),

    setType: builder.mutation<SetTypeResponse, SetTypeParams>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/type-id`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, typeId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, typeId, mulighet: null }));

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => ({ ...draft, ...data }));
        } catch (error) {
          undo();
        }
      },
    }),

    setKlagemulighet: builder.mutation<SetMulighetResponse, SetKlagemulighetParams>({
      query: ({ id, mulighet }) => ({
        url: `/registreringer/${id}/mulighet`,
        method: 'PUT',
        body: {
          mulighetId: mulighet.id,
          originalFagsystemId: mulighet.originalFagsystemId,
          currentFagsystemId: mulighet.currentFagsystemId,
        } satisfies SetMulighetPayload,
      }),
      onQueryStarted: async ({ id, mulighet }, { dispatch, queryFulfilled }) => {
        const mulighetPatchResult = dispatch(
          muligheterApi.util.updateQueryData('getKlagemulighet', id, () => mulighet),
        );

        // Optimistically updating `registrering.mulighet` will cause the application try to fetch the mulighet and fail because the PUT request is very slow.

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => ({ ...draft, ...data }));
        } catch (error) {
          mulighetPatchResult.undo();
        }
      },
    }),

    setAnkemulighet: builder.mutation<SetMulighetResponse, SetAnkemulisghetParams>({
      query: ({ id, mulighet }) => ({
        url: `/registreringer/${id}/mulighet`,
        method: 'PUT',
        body: {
          mulighetId: mulighet.id,
          originalFagsystemId: mulighet.originalFagsystemId,
          currentFagsystemId: mulighet.currentFagsystemId,
        } satisfies SetMulighetPayload,
      }),
      onQueryStarted: async ({ id, mulighet }, { dispatch, queryFulfilled }) => {
        const undoList: (() => void)[] = [];
        const mulighetPatchResult = dispatch(muligheterApi.util.updateQueryData('getAnkemulighet', id, () => mulighet));
        undoList.push(mulighetPatchResult.undo);

        if (
          mulighet.typeId === SaksTypeEnum.ANKE &&
          mulighet.currentFagsystemId === FagsystemId.KABAL &&
          mulighet.ytelseId !== null
        ) {
          undoList.push(updateDrafts(id, (draft) => ({ ...draft, ytelseId: mulighet.ytelseId })));
        }

        // Optimistically updating `registrering.mulighet` will cause the application try to fetch the mulighet and fail because the PUT request is very slow.

        try {
          const { data } = await queryFulfilled;
          updateDrafts(id, (draft) => ({ ...draft, ...data }));
        } catch (error) {
          undoList.forEach((undo) => undo());
        }
      },
    }),
  }),
});

export const {
  useSetSakenGjelderMutation,
  useSetJournalpostIdMutation,
  useSetTypeMutation,
  useSetAnkemulighetMutation,
  useSetKlagemulighetMutation,
} = mutationsSlice;
