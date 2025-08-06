import { AppTheme, useAppTheme } from '@app/app-theme';
import { CardFullHeight } from '@app/components/card/card';
import { DocumentTitle } from '@app/components/document-viewer/document-title';
import { getDocumentUrl } from '@app/components/documents/document/use-view-document';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { DocumentViewerContext, type ViewedVedlegg } from '@app/pages/registrering/document-viewer-context';
import { type IArkivertDocument, VariantFormat } from '@app/types/dokument';
import { FileTextIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';

const DEFAULT_NAME = '<Mangler navn>';

export const DocumentViewer = () => {
  const { dokument } = useContext(DocumentViewerContext);

  if (dokument === null) {
    return (
      <CardFullHeight>
        <Container>
          <Placeholder>
            <FileTextIcon aria-hidden />
          </Placeholder>
        </Container>
      </CardFullHeight>
    );
  }

  return (
    <CardFullHeight>
      <Container>
        <Content dokument={dokument} />
      </Container>
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
      <StyledLoader size="3xlarge" />
      <StyledObject
        data={`${url}#toolbar=1&view=fitH&zoom=page-width`}
        role="document"
        type="application/pdf"
        name={tittel ?? DEFAULT_NAME}
        id="document-viewer"
        style={{ filter: appTheme === AppTheme.DARK ? 'hue-rotate(180deg) invert(1)' : 'none' }}
      />
    </>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  border-radius: 4px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const LOADER_WIDTH = 15;
const LOADER_LEFT = (100 - LOADER_WIDTH) / 2;

const StyledLoader = styled(Loader)`
  position: absolute;
  width: ${LOADER_WIDTH}%;
  top: 30%;
  left: ${LOADER_LEFT}%;
  z-index: 0;
`;

const StyledObject = styled.object`
  position: relative; 
  width: 100%;
  flex-grow: 1;
  z-index: 1;
`;
