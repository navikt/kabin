import type { RegistreringDokument } from '@app/redux/api/registreringer/types';

interface IDocumentId {
  dokumentInfoId: string;
  journalpostId: string;
}

export const compareDocuments = (a: IDocumentId, b: IDocumentId): boolean =>
  a.dokumentInfoId === b.dokumentInfoId && a.journalpostId === b.journalpostId;

/** Sorts documents by `sortIndex` ascending - full stop. The document with the lowest
 * `sortIndex` is the hoveddokument. */
export const compareDokumenter = (a: RegistreringDokument, b: RegistreringDokument): number =>
  a.sortIndex - b.sortIndex;

/** Whether `dokument` is the hoveddokument, i.e. has the lowest `sortIndex` among `dokumenter`.
 * `dokumenter` must include `dokument` itself. */
export const isHoveddokument = (dokument: RegistreringDokument, dokumenter: RegistreringDokument[]): boolean =>
  dokumenter.every((d) => d.sortIndex >= dokument.sortIndex);
