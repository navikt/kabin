interface IDocumentId {
  dokumentInfoId: string;
  journalpostId: string;
}

export const compareDocuments = (a: IDocumentId, b: IDocumentId): boolean =>
  a.dokumentInfoId === b.dokumentInfoId && a.journalpostId === b.journalpostId;
