import { ContentType } from '@app/components/documents/upload/content-type';
import { toast } from '@app/components/toast/store';
import { nowAsBackendDateTime } from '@app/domain/date';
import { createAppendedSortIndex } from '@app/domain/sort-index';
import { uploadToBucket } from '@app/functions/upload-to-bucket';
import { useRegistrering } from '@app/hooks/use-registrering';
import { pushError } from '@app/observability';
import {
  addDokumenter,
  removeDokument,
  replaceDokumentId,
  updateDokumentMetadata,
  useCreateDokumentUploadsMutation,
} from '@app/redux/api/registreringer/documents';
import type { DokumentUpload } from '@app/redux/api/registreringer/response-types';
import { DokumentStatus, type RegistreringDokument } from '@app/redux/api/registreringer/types';
import { useCallback, useRef, useState } from 'react';

export const ACCEPTED_FILE_TYPES = Object.values(ContentType).join(',');

export interface UploadProgressEntry {
  percent: number;
  failed: boolean;
  /** Average upload speed in bytes per second, since the upload started. */
  bytesPerSecond?: number;
}
type SetProgress = React.Dispatch<React.SetStateAction<Record<string, UploadProgressEntry>>>;
type AbortControllers = React.RefObject<Map<string, AbortController>>;
type StartTimes = React.RefObject<Map<string, number>>;

const INITIAL_UPLOAD_PROGRESS: UploadProgressEntry = { percent: 0, failed: false };

/** Manages requesting upload URLs and uploading files to the bucket in parallel, while tracking
 * per-file byte-upload progress locally (kept out of Redux, since progress events fire frequently). */
export const useUploadFiles = (registreringId: string) => {
  const { uploadedDocuments } = useRegistrering();
  const [createDokumentUploads] = useCreateDokumentUploadsMutation();
  const [progress, setProgress] = useState<Record<string, UploadProgressEntry>>({});
  // Locally generated document IDs that haven't been swapped for a real, server-known ID
  // yet (see `tempIds` below). Server-backed actions (rename/delete/set-as-hoveddokument) must be
  // disabled for these — sending a temp ID to the server would fail, and could race with the
  // upload-url response swapping in the real ID via `replaceDokumentId`.
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const startTimes = useRef<Map<string, number>>(new Map());

  // Kept up to date every render, without being a dependency of `uploadFiles` below, so that
  // callback stays referentially stable while still reading the current `sortIndex` values -
  // which new documents are placed after - whenever files are actually dropped.
  const dokumenterRef = useRef(uploadedDocuments.dokumenter);
  dokumenterRef.current = uploadedDocuments.dokumenter;

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) {
        return;
      }

      // Files are not blocked from uploading based on size — the total-size progress bar turns
      // red when the limit is exceeded, which makes the invalid state clear without preventing
      // the upload. This also avoids penalizing non-PDF files, which are converted and compressed
      // server-side, so their pre-conversion size isn't representative of the final stored size.

      // Show a placeholder row for every file immediately, using a locally generated ID, instead
      // of waiting for the upload-url request to resolve. Without this, the list wouldn't update
      // until the request completes, which can take a second or more.
      //
      // Built up front and written in a single `addDokumenter` call (rather than one `addDokument`
      // call per file) so dropping many files at once results in one store update instead of N.
      // The placeholders are complete documents, `sortIndex` included: they're spaced out after
      // the documents already present, exactly like the API spaces out newly uploaded documents,
      // so the rows appear in the dropped order right away. The server's response is still the
      // source of truth, and corrects the values via `replaceDokumentId` once it arrives.
      const now = new Date();
      const getSortIndex = createAppendedSortIndex(
        dokumenterRef.current.map((d) => d.sortIndex),
        files.length,
      );

      const placeholders: RegistreringDokument[] = files.map((file, index) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        created: nowAsBackendDateTime(now, index),
        status: DokumentStatus.UPLOADING,
        contentType: file.type,
        sortIndex: getSortIndex(index),
      }));

      const tempIds = placeholders.map((placeholder) => placeholder.id);
      const initialProgress = Object.fromEntries(tempIds.map((id) => [id, INITIAL_UPLOAD_PROGRESS]));

      addDokumenter(registreringId, placeholders);
      // Keeps the ref correct if `uploadFiles` is called again before React has re-rendered with
      // the placeholders read back from the store - the next batch then lands after this one.
      dokumenterRef.current = [...dokumenterRef.current, ...placeholders];
      setProgress((p) => ({ ...p, ...initialProgress }));
      setPendingIds((p) => new Set([...p, ...tempIds]));

      // A single upload-url request is made for all files, in file order. The API preserves the
      // order of the documents in its response, so the response can be zipped back with `files`.
      try {
        const { uploads } = await createDokumentUploads({
          id: registreringId,
          documents: files.map((file) => ({ contentType: file.type, name: file.name })),
        }).unwrap();

        for (const [index, dokumentUpload] of uploads.entries()) {
          const file = files[index];
          const tempId = tempIds[index];

          if (file === undefined || tempId === undefined) {
            continue;
          }

          // Swap the temporary, locally generated ID for the real one returned by the server, and
          // move the tracked progress across so the row keeps its already-visible state.
          replaceDokumentId(registreringId, tempId, { ...dokumentUpload.dokument, size: file.size });

          setProgress((p) => {
            const { [tempId]: progressEntry, ...rest } = p;
            return progressEntry === undefined ? rest : { ...rest, [dokumentUpload.dokument.id]: progressEntry };
          });

          setPendingIds((p) => {
            const next = new Set(p);
            next.delete(tempId);
            return next;
          });

          // The backend flags unsupported content types immediately in the upload-url response,
          // without ever handing back a bucket upload target — there's nothing to upload, so the
          // document is left at `UNSUPPORTED_TYPE` for the user to delete manually.
          if (dokumentUpload.dokument.status === DokumentStatus.UNSUPPORTED_TYPE) {
            continue;
          }

          // The bucket upload itself is not awaited here, so multiple files upload in parallel.
          startUpload({
            registreringId,
            file,
            dokumentUpload,
            setProgress,
            abortControllers,
            startTimes,
          });
        }
      } catch (e) {
        for (const tempId of tempIds) {
          removeDokument(registreringId, tempId);

          setProgress((p) => {
            const { [tempId]: _removed, ...rest } = p;
            return rest;
          });
        }

        setPendingIds((p) => {
          const next = new Set(p);
          for (const tempId of tempIds) {
            next.delete(tempId);
          }
          return next;
        });

        toast.error('Kunne ikke starte opplasting av filer');

        if (e instanceof Error) {
          pushError(e);
        }
      }
    },
    [registreringId, createDokumentUploads],
  );

  const abortUpload = useCallback((dokumentId: string) => {
    abortControllers.current.get(dokumentId)?.abort();
    abortControllers.current.delete(dokumentId);
  }, []);

  const isPending = useCallback((dokumentId: string) => pendingIds.has(dokumentId), [pendingIds]);

  return { uploadFiles, progress, abortUpload, isPending };
};

interface StartUploadParams {
  registreringId: string;
  file: File;
  dokumentUpload: DokumentUpload;
  setProgress: SetProgress;
  abortControllers: AbortControllers;
  startTimes: StartTimes;
}

const startUpload = ({
  registreringId,
  file,
  dokumentUpload: { upload, dokument },
  setProgress,
  abortControllers,
  startTimes,
}: StartUploadParams) => {
  if (upload === null) {
    // Should not happen: callers only reach this once `dokument.status` has already been checked
    // to not be `UNSUPPORTED_TYPE`, which is the only case where the backend omits `upload`.
    pushError(new Error(`Mangler opplastingsmål for dokument ${dokument.id}`));

    return;
  }

  // The document placeholder and its initial progress are already in place by the time this runs
  // (added optimistically before the upload-url request, then swapped to the real ID once it
  // resolved), so all that's left is to start the actual byte upload.

  // Not awaited: lets the caller move on to the next file while this one uploads in the background.
  uploadFileToBucket({
    registreringId,
    dokumentId: dokument.id,
    uploadUrl: upload.uploadUrl,
    fields: upload.fields,
    file,
    setProgress,
    abortControllers,
    startTimes,
  });
};

interface UploadFileToBucketParams {
  registreringId: string;
  dokumentId: string;
  uploadUrl: string;
  fields: Record<string, string>;
  file: File;
  setProgress: SetProgress;
  abortControllers: AbortControllers;
  startTimes: StartTimes;
}

const uploadFileToBucket = async ({
  registreringId,
  dokumentId,
  uploadUrl,
  fields,
  file,
  setProgress,
  abortControllers,
  startTimes,
}: UploadFileToBucketParams) => {
  const abortController = new AbortController();
  abortControllers.current.set(dokumentId, abortController);
  startTimes.current.set(dokumentId, performance.now());

  try {
    await uploadToBucket({
      uploadUrl,
      fields,
      file,
      signal: abortController.signal,
      onProgress: (loaded, total) => {
        const startTime = startTimes.current.get(dokumentId) ?? performance.now();
        const elapsedSeconds = (performance.now() - startTime) / 1000;
        const bytesPerSecond = elapsedSeconds > 0 ? loaded / elapsedSeconds : 0;
        const percent = Math.round((loaded / total) * 100);

        setProgress((p) => ({ ...p, [dokumentId]: { percent, failed: false, bytesPerSecond } }));
      },
    });

    updateDokumentMetadata(registreringId, dokumentId, {
      status: DokumentStatus.UPLOADING_DONE,
      size: file.size,
      contentType: file.type,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return;
    }

    setProgress((p) => ({ ...p, [dokumentId]: { percent: p[dokumentId]?.percent ?? 0, failed: true } }));
    toast.error(`Opplasting av «${file.name}» feilet`);

    if (e instanceof Error) {
      pushError(e);
    }
  } finally {
    abortControllers.current.delete(dokumentId);
    startTimes.current.delete(dokumentId);
  }
};
