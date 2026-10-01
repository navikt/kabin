import { useRegistrering } from '@app/hooks/use-registrering';
import type { IArkivertDocument, IVedlegg } from '@app/types/dokument';
import { createContext, useMemo, useState } from 'react';

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

  // Memoized, so registrering updates don't re-render consumers. The document URLs are cache-busted on every render.
  // `dokument` and `setDokument` are stable enough, but the `value` object is not.
  // `setDokument` is completely stable and cannot be put in useMemo dependencies.
  const value = useMemo(() => ({ viewDokument: setDokument, dokument }), [dokument]);

  return <DocumentViewerContext.Provider value={value}>{children}</DocumentViewerContext.Provider>;
};
