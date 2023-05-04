import { FileTextIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { CardFullHeight } from '@app/components/card/card';
import { getDocumentUrl } from '@app/components/documents/use-view-document';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { DocumentViewerContext, IViewedDocument } from '@app/pages/create/document-viewer-context';
import { DocumentTitle } from './document-title';

const DEFAULT_NAME = '<Mangler navn>';

export const DocumentViewer = () => {
  const { dokument } = useContext(DocumentViewerContext);

  return (
    <CardFullHeight>
      <Container>
        <Content dokument={dokument} />
      </Container>
    </CardFullHeight>
  );
};

const Content = ({ dokument }: { dokument: IViewedDocument | null }) => {
  if (dokument === null) {
    return (
      <Placeholder>
        <FileTextIcon aria-hidden />
      </Placeholder>
    );
  }

  const url = getDocumentUrl(dokument.journalpostId, dokument.dokumentInfoId);

  return (
    <>
      <DocumentTitle url={url} />
      <PDF tittel={dokument.tittel} url={url} />
    </>
  );
};

interface PDFProps {
  url: string;
  tittel: string | null;
}

const PDF = ({ url, tittel }: PDFProps) => (
  <>
    <StyledLoader size="3xlarge" />
    <StyledObject
      data={`${url}#toolbar=1&view=fitH&zoom=page-width`}
      role="document"
      type="application/pdf"
      name={tittel ?? DEFAULT_NAME}
      id="document-viewer"
    />
  </>
);

const Container = styled.div`
  position: relative;
  width: 100%;
  border-radius: 4px;
  flex-grow: 1;
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
  height: 100%;
  z-index: 1;
`;
