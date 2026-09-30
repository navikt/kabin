import { useRegistrering } from '@app/hooks/use-registrering';
import type { IArkivertDocument, IVedlegg } from '@app/types/dokument';
import { createContext, useState } from 'react';

export interface ViewedVedlegg extends IVedlegg {
  journalpostId: string;
}

export interface ViewedUploadedDokument {
  kind: 'uploaded';
  registreringId: string;
  dokumentId: string;
  name: string;
  contentType: string;
}

export type IViewedDocument = IArkivertDocument | ViewedVedlegg | ViewedUploadedDokument | null;

export const isViewedUploadedDokument = (dokument: NonNullable<IViewedDocument>): dokument is ViewedUploadedDokument =>
  'kind' in dokument && dokument.kind === 'uploaded';

interface IDocumentViewerContext {
  dokument: IViewedDocument;
  viewDokument: (value: IViewedDocument) => void;
}

export const DocumentViewerContext = createContext<IDocumentViewerContext>({
  dokument: null,
  viewDokument: () => undefined,
});

interface Props {
  children: React.ReactNode;
}

export const DocumentViewerContextState = ({ children }: Props) => {
  const { sakenGjelderValue } = useRegistrering();
  const [dokument, setDokument] = useState<IViewedDocument | null>(null);
  const [previousSakenGjelderValue, setPreviousSakenGjelderValue] = useState(sakenGjelderValue);

  // Reset during render, so the previous person's document is never rendered for the new person.
  if (previousSakenGjelderValue !== sakenGjelderValue) {
    setPreviousSakenGjelderValue(sakenGjelderValue);
    setDokument(null);
  }

  return (
    <DocumentViewerContext.Provider value={{ viewDokument: setDokument, dokument }}>
      {children}
    </DocumentViewerContext.Provider>
  );
};
