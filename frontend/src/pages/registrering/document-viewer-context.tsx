import { useGetArkivertDokumentQuery } from '@app/redux/api/journalposter';
import type { IArkivertDocument, IVedlegg } from '@app/types/dokument';
import { skipToken } from '@reduxjs/toolkit/query';
import { createContext, useState } from 'react';

export interface ViewedVedlegg extends IVedlegg {
  journalpostId: string;
}
export type IViewedDocument = IArkivertDocument | ViewedVedlegg | null;

interface IDocumentViewerContext {
  dokument: IViewedDocument;
  viewDokument: (value: IViewedDocument) => void;
}

const DEFAULT_DOKUMENT_NAME = 'Ukjent dokumentnavn';

export const DocumentViewerContext = createContext<IDocumentViewerContext>({
  dokument: null,
  viewDokument: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const DocumentViewerContextState = ({ children }: Props) => {
  const [dokument, setDokument] = useState<IViewedDocument | null>(null);
  const { data } = useGetArkivertDokumentQuery(dokument?.journalpostId ?? skipToken);

  return (
    <DocumentViewerContext.Provider value={{ viewDokument: setDokument, dokument: data ?? null }}>
      {children}
    </DocumentViewerContext.Provider>
  );
};
