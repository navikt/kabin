import { AppTheme, useAppTheme } from '@app/app-theme';
import { CardFullHeight } from '@app/components/card/card';
import { DocumentTitle } from '@app/components/document-viewer/document-title';
import { getDocumentUrl } from '@app/components/documents/document/use-view-document';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { DocumentViewerContext, type ViewedVedlegg } from '@app/pages/registrering/document-viewer-context';
import { type IArkivertDocument, VariantFormat } from '@app/types/dokument';
import { FileTextIcon } from '@navikt/aksel-icons';
import { Loader, VStack } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';

const DEFAULT_NAME = '<Mangler navn>';

export const DocumentViewer = () => {
  const { dokument } = useContext(DocumentViewerContext);

  if (dokument === null) {
    return (
      <CardFullHeight>
        <VStack position="relative" width="100%" flexGrow="1" className="rounded">
          <Placeholder>
            <FileTextIcon aria-hidden />
          </Placeholder>
        </VStack>
      </CardFullHeight>
    );
  }

  return (
    <CardFullHeight>
      <VStack position="relative" width="100%" flexGrow="1" className="rounded">
        <Content dokument={dokument} />
      </VStack>
    </CardFullHeight>
  );
};

interface IContentProps {
  dokument: IArkivertDocument | ViewedVedlegg;
}

const Content = ({ dokument }: IContentProps) => {
  const hasRedactedDocument = dokument.varianter.some(({ format }) => format === VariantFormat.SLADDET);
  const [showRedacted, setShowRedacted] = useState(hasRedactedDocument);

  useEffect(() => {
    setShowRedacted(hasRedactedDocument);
  }, [hasRedactedDocument]);

  const format = showRedacted ? VariantFormat.SLADDET : VariantFormat.ARKIV;
  const url = getDocumentUrl(dokument.journalpostId, dokument.dokumentInfoId, { format });

  return (
    <>
      <DocumentTitle
        url={url}
        format={format}
        hasRedactedDocument={hasRedactedDocument}
        showRedacted={showRedacted}
        setShowRedacted={setShowRedacted}
      />
      <PDF tittel={dokument.tittel} url={url} />
    </>
  );
};

interface PDFProps {
  url: string;
  tittel: string | null;
}

const PDF = ({ url, tittel }: PDFProps) => {
  const appTheme = useAppTheme();

  return (
    <>
      <Loader size="3xlarge" className="absolute top-[30%] left-[42.5%] z-0 w-[15%]" />
      <object
        className="relative z-1 w-full grow"
        data={`${url}#toolbar=1&view=fitH&zoom=page-width`}
        type="application/pdf"
        name={tittel ?? DEFAULT_NAME}
        id="document-viewer"
        style={{ filter: appTheme === AppTheme.DARK ? 'hue-rotate(180deg) invert(1)' : 'none' }}
        aria-label={tittel ?? DEFAULT_NAME}
      />
    </>
  );
};
