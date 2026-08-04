import { IS_LOCALHOST } from '@app/redux/api/common';
import {
  type PartialDraftRegistrering,
  pessimisticUpdate,
  updateDrafts,
} from '@app/redux/api/registreringer/draft-updates';
import type {
  SetAdditionalKabalMulighetParams,
  SetAnkemulighetParams,
  SetNonAnkemulighetParams,
  SetTypeParams,
} from '@app/redux/api/registreringer/param-types';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import type {
  SetAdditionalKabalMulighetResponse,
  SetMulighetResponse,
  SetTypeResponse,
} from '@app/redux/api/registreringer/response-types';
import type { DraftRegistrering } from '@app/redux/api/registreringer/types';
import { InngaaendeKanal, Source } from '@app/redux/api/registreringer/types';
import { type RegistreringType, SaksTypeEnum } from '@app/types/common';
import { FagsystemId } from '@app/types/mulighet';

interface SetMulighetPayload {
  mulighetId: string;
}

const mutationsSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
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
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),

    setJournalpostId: builder.mutation<DraftRegistrering, { id: string; journalpostId: string }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/journalpost-id`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, journalpostId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, journalpostId }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),

    setSource: builder.mutation<DraftRegistrering, { id: string; source: Source }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/source`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, source }, { queryFulfilled }) => {
        // Captured so the optimistically set fields can be restored on failure without relying on
        // `undo()`'s snapshot-based rollback, which would revert the entire cached registrering to
        // its pre-update state - clobbering a newer, already-successful `setSource` call. See
        // `restoreSource` below.
        let previous: SourceFields | null = null;
        let optimistic: SourceFields | null = null;

        updateDrafts(id, (draft) => {
          const updated = withSourceSideEffects(draft, source);

          previous = getSourceFields(draft);
          optimistic = getSourceFields(updated);

          return updated;
        });

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, getNonSourceFields(data));
        } catch {
          restoreSource(id, optimistic, previous);
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
        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          typeId,
          mulighetIsBasedOnJournalpost: false,
          mulighet: null,
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),

    setAnkemulighet: builder.mutation<SetMulighetResponse, SetAnkemulighetParams>({
      query: ({ id, mulighet }) => ({
        url: `/registreringer/${id}/mulighet`,
        method: 'PUT',
        body: { mulighetId: mulighet.id } satisfies SetMulighetPayload,
      }),
      onQueryStarted: async ({ id, mulighet }, { queryFulfilled }) => {
        const shouldSetYtelseId =
          mulighet.typeId === SaksTypeEnum.ANKE &&
          mulighet.currentFagsystemId === FagsystemId.KABAL &&
          mulighet.ytelseId !== null;

        const undo = updateDrafts(id, (draft) => ({
          ...draft,
          mulighet: { id: mulighet.id },
          overstyringer: {
            ...draft.overstyringer,
            ytelseId: shouldSetYtelseId ? mulighet.ytelseId : draft.overstyringer.ytelseId,
          },
        }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),

    setNonAnkemulighet: builder.mutation<SetMulighetResponse, SetNonAnkemulighetParams>({
      query: ({ id, mulighet }) => ({
        url: `/registreringer/${id}/mulighet`,
        method: 'PUT',
        body: { mulighetId: mulighet.id },
      }),
      onQueryStarted: async ({ id, mulighet }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, mulighet: { id: mulighet.id } }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),

    setMulighetIsBasedOnJournalpost: builder.mutation<
      DraftRegistrering,
      { id: string; mulighetIsBasedOnJournalpost: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/mulighet-is-based-on-journalpost`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, mulighetIsBasedOnJournalpost }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, mulighetIsBasedOnJournalpost, mulighet: null }));

        try {
          const { data } = await queryFulfilled;
          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),

    setMulighetBasedOnJournalpost: builder.mutation<DraftRegistrering, { id: string; journalpostId: string }>({
      query: ({ id, ...body }) => ({
        url: `/registreringer/${id}/mulighet-based-on-journalpost`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ id, journalpostId }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, mulighet: { id: journalpostId } }));

        try {
          const { data } = await queryFulfilled;

          pessimisticUpdate(id, data);
        } catch {
          undo();
        }
      },
    }),

    setAdditionalKabalMulighet: builder.mutation<SetAdditionalKabalMulighetResponse, SetAdditionalKabalMulighetParams>({
      query: ({ id, mulighet }) => ({
        url: `/registreringer/${id}/additional-kabal-mulighet`,
        method: 'PUT',
        body: { mulighetId: mulighet.id },
      }),
      onQueryStarted: async ({ id, mulighet }, { queryFulfilled }) => {
        const undo = updateDrafts(id, (draft) => ({ ...draft, additionalKabalMulighet: { id: mulighet.id } }));

        try {
          const { data } = await queryFulfilled;

          pessimisticUpdate(id, { overstyringer: { ytelseId: data.ytelseId, hjemmelIdList: data.hjemmelIdList } });
        } catch {
          undo();
        }
      },
    }),
  }),
});

export const {
  useSetSakenGjelderMutation,
  useSetJournalpostIdMutation,
  useSetSourceMutation,
  useSetTypeMutation,
  useSetAnkemulighetMutation,
  useSetMulighetIsBasedOnJournalpostMutation,
  useSetMulighetBasedOnJournalpostMutation,
  useSetNonAnkemulighetMutation,
  useSetAdditionalKabalMulighetMutation,
} = mutationsSlice;

/** Fields the API sets as a side effect of `setSource`, tracked so the ones that are known up
 * front can be set optimistically and selectively restored on failure. */
interface SourceFields {
  source: Source;
  typeId: RegistreringType | null;
  mulighetIsBasedOnJournalpost: boolean;
  inngaaendeKanal: InngaaendeKanal | null;
}

const getSourceFields = ({
  source,
  typeId,
  mulighetIsBasedOnJournalpost,
  uploadedDocuments,
}: DraftRegistrering): SourceFields => ({
  source,
  typeId,
  mulighetIsBasedOnJournalpost,
  inngaaendeKanal: uploadedDocuments.inngaaendeKanal,
});

/** Everything in the response except the fields set optimistically by `setSource`. Those are left
 * as they are in the cache - applying them would let an older response clobber a newer, still
 * in-flight `setSource` call that has already applied them optimistically. Everything else is
 * applied from the response, since it is only known server-side (e.g.
 * `overstyringer.avsender`). */
const getNonSourceFields = ({
  source: _source,
  typeId: _typeId,
  mulighetIsBasedOnJournalpost: _mulighetIsBasedOnJournalpost,
  uploadedDocuments: { inngaaendeKanal: _inngaaendeKanal, ...uploadedDocuments },
  ...rest
}: DraftRegistrering): PartialDraftRegistrering => ({ ...rest, uploadedDocuments });

/** `Source.ANKE` is always an anke received through Altinn, so the API sets `typeId` and
 * `inngaaendeKanal` along with the source. Both values are known up front and are therefore set
 * optimistically. `overstyringer.avsender` is set server-side as well, but its value cannot be
 * derived here, so it is left to the response. */
const withSourceSideEffects = (draft: DraftRegistrering, source: Source): DraftRegistrering =>
  source === Source.ANKE
    ? {
        ...draft,
        source,
        typeId: SaksTypeEnum.ANKE,
        mulighetIsBasedOnJournalpost: false,
        uploadedDocuments: { ...draft.uploadedDocuments, inngaaendeKanal: InngaaendeKanal.ALTINN_INNBOKS },
      }
    : { ...draft, typeId: null, mulighetIsBasedOnJournalpost: false, source };

/** Reverts the optimistic `setSource` changes on failure, field by field, but only those still
 * set to their optimistic value - i.e. nothing else (e.g. a newer, already-successful
 * `setSource` call) has since changed them. */
const restoreSource = (id: string, optimistic: SourceFields | null, previous: SourceFields | null) => {
  if (optimistic === null || previous === null) {
    return;
  }

  updateDrafts(id, (draft) => ({
    ...draft,
    source: draft.source === optimistic.source ? previous.source : draft.source,
    typeId: draft.typeId === optimistic.typeId ? previous.typeId : draft.typeId,
    // Always optimistically set to `false`, so - unlike the other fields - an unchanged value
    // can't distinguish "nothing else touched it" from "a newer `setSource` set it to `false`
    // too". Restoring is still the better guess: the newer call sets it to `false` again on
    // success, and its own response is applied after this one's failure.
    mulighetIsBasedOnJournalpost:
      draft.mulighetIsBasedOnJournalpost === optimistic.mulighetIsBasedOnJournalpost
        ? previous.mulighetIsBasedOnJournalpost
        : draft.mulighetIsBasedOnJournalpost,
    uploadedDocuments:
      draft.uploadedDocuments.inngaaendeKanal === optimistic.inngaaendeKanal
        ? { ...draft.uploadedDocuments, inngaaendeKanal: previous.inngaaendeKanal }
        : draft.uploadedDocuments,
  }));
};
