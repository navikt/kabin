import { KABIN_API_BASE_PATH } from '@app/redux/api/common';

/** Builds the URL for viewing an uploaded document. Once `status` is `DokumentStatus.DONE`, this always serves a PDF. */
export const getUploadedDocumentUrl = (registreringId: string, dokumentId: string): string =>
  `${KABIN_API_BASE_PATH}/registreringer/${registreringId}/uploaded-documents/dokumenter/${dokumentId}/view?version=${Date.now()}`;
