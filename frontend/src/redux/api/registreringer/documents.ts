import { IS_LOCALHOST } from '@app/redux/api/common';
import { isStaleResponse, updateDrafts } from '@app/redux/api/registreringer/draft-updates';
import type {
  CreateDokumentUploadsParams,
  DeleteDokumentParams,
  ResetDokumentStatusParams,
  SetDokumentNameParams,
  SetDokumentSortIndexParams,
  SetInngaaendeKanalParams,
} from '@app/redux/api/registreringer/param-types';
import { registreringApi } from '@app/redux/api/registreringer/registrering';
import type {
  CreateDokumentUploadsResponse,
  DeleteDokumentResponse,
  ResetDokumentStatusResponse,
  SetDokumentNameResponse,
  SetDokumentSortIndexResponse,
  SetInngaaendeKanalResponse,
} from '@app/redux/api/registreringer/response-types';
import type { InngaaendeKanal, RegistreringDokument, UploadedDocuments } from '@app/redux/api/registreringer/types';

const documentsSlice = registreringApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    createDokumentUploads: builder.mutation<CreateDokumentUploadsResponse, CreateDokumentUploadsParams>({
      query: ({ id, documents }) => ({
        url: `/registreringer/${id}/uploaded-documents/dokumenter`,
        method: 'POST',
        body: documents,
      }),
    }),

    setDokumentSortIndex: builder.mutation<SetDokumentSortIndexResponse, SetDokumentSortIndexParams>({
      query: ({ id, dokumentId, sortIndex }) => ({
        url: `/registreringer/${id}/uploaded-documents/dokumenter/${dokumentId}/sort-index`,
        method: 'PUT',
        body: { sortIndex },
      }),
      onQueryStarted: async ({ id, dokumentId, sortIndex }, { queryFulfilled }) => {
        // Captured so `sortIndex` can be restored on failure without relying on `undo()`'s
        // snapshot-based rollback. See `restoreDokumentSortIndex` below.
        let previousSortIndex: number | undefined;

        updateDrafts(id, (draft) => ({
          ...draft,
          uploadedDocuments: {
            ...draft.uploadedDocuments,
            dokumenter: draft.uploadedDocuments.dokumenter.map((d) => {
              if (d.id !== dokumentId) {
                return d;
              }

              previousSortIndex = d.sortIndex;

              return { ...d, sortIndex };
            }),
          },
        }));

        try {
          const { data } = await queryFulfilled;
          updateModified(id, data);
        } catch {
          if (previousSortIndex !== undefined) {
            restoreDokumentSortIndex(id, dokumentId, sortIndex, previousSortIndex);
          }
        }
      },
    }),

    setInngaaendeKanal: builder.mutation<SetInngaaendeKanalResponse, SetInngaaendeKanalParams>({
      query: ({ id, inngaaendeKanal }) => ({
        url: `/registreringer/${id}/uploaded-documents/inngaaende-kanal`,
        method: 'PUT',
        body: { inngaaendeKanal },
      }),
      onQueryStarted: async ({ id, inngaaendeKanal }, { queryFulfilled }) => {
        // Captured so `inngaaendeKanal` can be restored on failure without relying on `undo()`'s
        // snapshot-based rollback. See `restoreInngaaendeKanal` below.
        let previousInngaaendeKanal: InngaaendeKanal | null = null;

        updateDrafts(id, (draft) => {
          previousInngaaendeKanal = draft.uploadedDocuments.inngaaendeKanal;

          return { ...draft, uploadedDocuments: { ...draft.uploadedDocuments, inngaaendeKanal } };
        });

        try {
          const { data } = await queryFulfilled;
          updateModified(id, data);
        } catch {
          restoreInngaaendeKanal(id, inngaaendeKanal, previousInngaaendeKanal);
        }
      },
    }),

    setDokumentName: builder.mutation<SetDokumentNameResponse, SetDokumentNameParams>({
      query: ({ id, dokumentId, name }) => ({
        url: `/registreringer/${id}/uploaded-documents/dokumenter/${dokumentId}/name`,
        method: 'PUT',
        body: { name },
      }),
      onQueryStarted: async ({ id, dokumentId, name }, { queryFulfilled }) => {
        // Captured so the name can be restored on failure without relying on `undo()`'s
        // snapshot-based rollback. See `restoreDokumentName` below.
        let previousName: string | undefined;

        updateDrafts(id, (draft) => ({
          ...draft,
          uploadedDocuments: {
            ...draft.uploadedDocuments,
            dokumenter: draft.uploadedDocuments.dokumenter.map((d) => {
              if (d.id !== dokumentId) {
                return d;
              }

              previousName = d.name;

              return { ...d, name };
            }),
          },
        }));

        try {
          const { data } = await queryFulfilled;
          updateModified(id, data);
        } catch {
          if (previousName !== undefined) {
            restoreDokumentName(id, dokumentId, name, previousName);
          }
        }
      },
    }),

    deleteDokument: builder.mutation<DeleteDokumentResponse, DeleteDokumentParams>({
      query: ({ id, dokumentId }) => ({
        url: `/registreringer/${id}/uploaded-documents/dokumenter/${dokumentId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ id, dokumentId }, { queryFulfilled }) => {
        // Captured so the document can be restored on failure. Not relying on `undo()`'s
        // snapshot-based rollback here, since that would restore the entire cached registrering
        // to its pre-delete state - clobbering any other concurrent optimistic change, e.g.
        // another document deletion that completed successfully in the meantime. See
        // `restoreDokument` below. Deleting the current hoveddokument needs no special handling
        // here - the document with the next-lowest `sortIndex` automatically becomes it.
        let deletedDokument: RegistreringDokument | undefined;

        updateUploadedDocuments(id, (uploadedDocuments) => {
          deletedDokument = uploadedDocuments.dokumenter.find((d) => d.id === dokumentId);

          return {
            ...uploadedDocuments,
            dokumenter: uploadedDocuments.dokumenter.filter((d) => d.id !== dokumentId),
          };
        });

        try {
          const { data } = await queryFulfilled;
          updateModified(id, data);
        } catch {
          if (deletedDokument !== undefined) {
            restoreDokument(id, deletedDokument);
          }
        }
      },
    }),

    /**
     * Resets the status of one or more stuck/failed documents back to a non-terminal status,
     * server-side. This is only the first of the two steps that make up a "retry" from the
     * user's perspective:
     *
     * 1. This mutation resets the status (unstucks the document).
     * 2. `useDokumentConfirmSse`, in `upload-dokumenter.tsx`, re-opens the `/confirm` SSE
     *    connection as a side effect of the status becoming non-terminal again (its `enabled`
     *    flag is derived from `dokument.status` on every render) - and it's actually *opening
     *    that connection* which triggers the API to retry processing the document.
     */
    resetDokumentStatus: builder.mutation<ResetDokumentStatusResponse, ResetDokumentStatusParams>({
      query: ({ id, dokumentIds }) => ({
        url: `/registreringer/${id}/uploaded-documents/reset-status`,
        method: 'POST',
        body: { dokumentIds },
      }),
      onQueryStarted: async ({ id, dokumentIds }, { queryFulfilled }) => {
        const { data } = await queryFulfilled;

        for (const dokumentId of dokumentIds) {
          const dokument = data.uploadedDocuments.dokumenter.find((d) => d.id === dokumentId);

          if (dokument !== undefined) {
            updateDokumentMetadata(id, dokumentId, dokument);
          }
        }

        updateModified(id, data);
      },
    }),
  }),
});

export const {
  useCreateDokumentUploadsMutation,
  useSetDokumentSortIndexMutation,
  useSetInngaaendeKanalMutation,
  useSetDokumentNameMutation,
  useDeleteDokumentMutation,
  useResetDokumentStatusMutation,
} = documentsSlice;

/** Adds newly created (not-yet-uploaded) document placeholders to the draft, optimistically, in
 * a single update. The placeholders are complete documents - `sortIndex` included, computed by
 * the caller, which knows the whole batch - so they are simply appended here. The server's
 * response is the source of truth and corrects them via `replaceDokumentId` once it arrives. */
export const addDokumenter = (id: string, dokumenter: RegistreringDokument[]) =>
  updateUploadedDocuments(id, (uploadedDocuments) => ({
    ...uploadedDocuments,
    dokumenter: [...uploadedDocuments.dokumenter, ...dokumenter],
  }));

/** Removes a document placeholder from the draft, e.g. when the upload-url request fails
 * for a document that was optimistically added before the request completed. */
export const removeDokument = (id: string, dokumentId: string) =>
  updateUploadedDocuments(id, (uploadedDocuments) => ({
    ...uploadedDocuments,
    dokumenter: uploadedDocuments.dokumenter.filter((d) => d.id !== dokumentId),
  }));

/** Re-adds a document that was optimistically removed, e.g. when `deleteDokument` fails.
 * Applied against the *current* `dokumenter`, rather than restoring a snapshot taken when the
 * optimistic removal happened, so an unrelated document deletion that completed successfully in
 * the meantime isn't undone along with it. No-ops if the document is already present, e.g. if it
 * was independently restored by a server response. */
const restoreDokument = (id: string, dokument: RegistreringDokument) =>
  updateUploadedDocuments(id, (uploadedDocuments) =>
    uploadedDocuments.dokumenter.some((d) => d.id === dokument.id)
      ? uploadedDocuments
      : { ...uploadedDocuments, dokumenter: [...uploadedDocuments.dokumenter, dokument] },
  );

/** Reverts an optimistic `inngaaendeKanal` change on failure, but only if it's still set to the
 * optimistic value - i.e. nothing else (e.g. a newer `setInngaaendeKanal` call) has since changed
 * it. Applied against the current draft rather than a snapshot taken when the optimistic update
 * happened, so an unrelated concurrent change to the registrering isn't undone along with it. */
const restoreInngaaendeKanal = (
  id: string,
  optimisticValue: InngaaendeKanal | null,
  previousValue: InngaaendeKanal | null,
) =>
  updateDrafts(id, (draft) =>
    draft.uploadedDocuments.inngaaendeKanal === optimisticValue
      ? { ...draft, uploadedDocuments: { ...draft.uploadedDocuments, inngaaendeKanal: previousValue } }
      : draft,
  );

/** Reverts an optimistic document rename on failure, but only for the document whose name is
 * still set to the optimistic value - i.e. nothing else (e.g. a newer rename, or the document
 * being deleted in the meantime) has since changed or removed it. Applied against the current
 * draft rather than a snapshot taken when the optimistic update happened, so an unrelated
 * concurrent change to the registrering isn't undone along with it. */
const restoreDokumentName = (id: string, dokumentId: string, optimisticName: string, previousName: string) =>
  updateDrafts(id, (draft) => ({
    ...draft,
    uploadedDocuments: {
      ...draft.uploadedDocuments,
      dokumenter: draft.uploadedDocuments.dokumenter.map((d) =>
        d.id === dokumentId && d.name === optimisticName ? { ...d, name: previousName } : d,
      ),
    },
  }));

/** Reverts an optimistic `sortIndex` change on failure, but only for the document whose
 * `sortIndex` is still set to the optimistic value - i.e. nothing else (e.g. a newer move, or the
 * document being deleted in the meantime) has since changed or removed it. Applied against the
 * current draft rather than a snapshot taken when the optimistic update happened, so an unrelated
 * concurrent change to the registrering isn't undone along with it. */
const restoreDokumentSortIndex = (
  id: string,
  dokumentId: string,
  optimisticSortIndex: number,
  previousSortIndex: number,
) =>
  updateDrafts(id, (draft) => ({
    ...draft,
    uploadedDocuments: {
      ...draft.uploadedDocuments,
      dokumenter: draft.uploadedDocuments.dokumenter.map((d) =>
        d.id === dokumentId && d.sortIndex === optimisticSortIndex ? { ...d, sortIndex: previousSortIndex } : d,
      ),
    },
  }));

/** Replaces a temporary, locally generated document ID with the real ID (and other fields,
 * including the real `sortIndex`) returned by the upload-url response, once it resolves. */
export const replaceDokumentId = (id: string, tempId: string, dokument: RegistreringDokument) =>
  updateUploadedDocuments(id, (uploadedDocuments) => ({
    ...uploadedDocuments,
    dokumenter: uploadedDocuments.dokumenter.map((d) => (d.id === tempId ? dokument : d)),
  }));

/** Fields describing a document's status change, e.g. from SSE events or upload progress. */
type DokumentStatusUpdate = Pick<RegistreringDokument, 'status' | 'size' | 'contentType'>;

/** Updates the status, size, and content type of a single document. Only these three fields are
 * applied - other fields are left untouched, even if `update` is (or contains) a full document,
 * e.g. `RegistreringDokument`, so this can't clobber unrelated in-flight optimistic changes such
 * as a rename or reorder. */
export const updateDokumentMetadata = (id: string, dokumentId: string, update: DokumentStatusUpdate) =>
  updateDrafts(id, (draft) => ({
    ...draft,
    uploadedDocuments: {
      ...draft.uploadedDocuments,
      dokumenter: draft.uploadedDocuments.dokumenter.map((d) =>
        d.id === dokumentId ? { ...d, status: update.status, size: update.size, contentType: update.contentType } : d,
      ),
    },
  }));

/** Persists a response's `modified` timestamp to the draft, without touching any other field.
 * For mutations whose response only ever echoes back the value that was already applied
 * optimistically (e.g. `setInngaaendeKanal`), there's no new information to apply besides
 * `modified` itself - re-applying the echoed value on top of the draft would only risk
 * regressing it if this response happens to resolve after a newer one for the same field. */
const updateModified = (id: string, response: { modified?: string }) =>
  updateDrafts(id, (draft) =>
    response.modified === undefined || isStaleResponse(response, draft)
      ? draft
      : { ...draft, modified: response.modified },
  );

/** Applies a client-only (optimistic) update to `uploadedDocuments`. Centralizes the boilerplate
 * of reaching into `draft.uploadedDocuments` for the handful of call sites that only touch that
 * slice of the draft. */
const updateUploadedDocuments = (
  id: string,
  update: (uploadedDocuments: UploadedDocuments) => UploadedDocuments,
): (() => void) => updateDrafts(id, (draft) => ({ ...draft, uploadedDocuments: update(draft.uploadedDocuments) }));
