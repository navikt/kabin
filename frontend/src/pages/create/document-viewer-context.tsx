import React, { useState } from 'react';

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
  dokument: IViewedDocument | null;
  viewDokument: (value: ISetViewedDocument | null) => void;
}

const DEFAULT_DOKUMENT_NAME = 'Ukjent dokumentnavn';

export const DocumentViewerContext = React.createContext<IDocumentViewerContext>({
  dokument: null,
  viewDokument: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const DocumentViewerContextState = ({ children }: Props) => {
  const [dokument, setDokument] = useState<IViewedDocument | null>(null);

  const viewDokument = (value: ISetViewedDocument | null) =>
    setDokument(value === null ? null : { ...value, tittel: value.tittel ?? DEFAULT_DOKUMENT_NAME });

  return <DocumentViewerContext.Provider value={{ dokument, viewDokument }}>{children}</DocumentViewerContext.Provider>;
};
