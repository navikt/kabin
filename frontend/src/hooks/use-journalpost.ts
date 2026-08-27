import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetArkivertDokumentQuery } from '@app/redux/api/journalposter';
import { isUploadSource, Source } from '@app/redux/api/registreringer/types';
import { skipToken } from '@reduxjs/toolkit/query/react';

/** `true` when the registrering's documents come from uploaded files rather than an existing
 * journalpost. In that case, `BaseRegistrering.journalpostId` is always `null` and nothing can
 * be derived from it - callers must not treat `journalpost === undefined` as "still loading" in
 * this case, since there is no journalpost to load. */
export const useIsUploadedDocuments = () => isUploadSource(useRegistrering().source);

/** `true` for the `Source.ANKE` variant of the upload flow, where `inngaaendeKanal`, `typeId`
 * and `overstyringer.avsender` are set by the API and cannot be changed by the user. */
export const useIsAnkeSource = () => useRegistrering().source === Source.ANKE;

/** `true` for the `Source.UPLOADED_DOCUMENTS` variant of the upload flow. */
export const useIsUploadedDocumentsSource = () => useRegistrering().source === Source.UPLOADED_DOCUMENTS;

export const useJournalpost = () => {
  const { journalpostId } = useRegistrering();
  return useGetArkivertDokumentQuery(journalpostId ?? skipToken);
};

export const useJournalpostFromMulighet = () => {
  const { mulighet, mulighetIsBasedOnJournalpost } = useRegistrering();

  return useGetArkivertDokumentQuery(
    mulighetIsBasedOnJournalpost && typeof mulighet?.id === 'string' ? mulighet.id : skipToken,
  );
};
