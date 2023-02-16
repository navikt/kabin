import React, { useState } from 'react';
import { IArkivertDocument } from '../../types/dokument';

interface IViewedDocumentId {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface IViewedDocument extends IViewedDocumentId {
  tittel: string | null;
}

interface ISetViewedDocument extends IViewedDocumentId {
  tittel: string | null;
}

interface IDocumentViewerContext {
  dokument: IViewedDocument;
  viewDokument: (value: ISetViewedDocument) => void;
}

const DEFAULT_DOKUMENT_NAME = 'Ukjent dokumentnavn';

export const DocumentViewerContext = React.createContext<IDocumentViewerContext>({
  dokument: {
    journalpostId: '',
    dokumentInfoId: '',
    tittel: DEFAULT_DOKUMENT_NAME,
  },
  viewDokument: () => {},
});

interface Props {
  children: React.ReactNode;
  initialDokument: IArkivertDocument;
}

export const DocumentViewerContextState = ({ initialDokument, children }: Props) => {
  const [dokument, setDokument] = useState<IViewedDocument>({
    tittel: initialDokument.tittel ?? DEFAULT_DOKUMENT_NAME,
    journalpostId: initialDokument.journalpostId,
    dokumentInfoId: initialDokument.dokumentInfoId,
  });

  const viewDokument = (value: ISetViewedDocument) =>
    setDokument({ ...value, tittel: value.tittel ?? DEFAULT_DOKUMENT_NAME });

  return <DocumentViewerContext.Provider value={{ dokument, viewDokument }}>{children}</DocumentViewerContext.Provider>;
};
