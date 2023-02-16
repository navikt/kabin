import { Loader } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { DocumentViewerContext, IViewedDocument } from '../../pages/create/document-viewer-context';
import { KABIN_API_BASE_PATH } from '../../simple-api-state/use-api';
import { Card } from '../card/card';
import { DocumentTitle } from './document-title';

const DEFAULT_NAME = '<Mangler navn>';

export const DocumentViewer = () => {
  const { dokument } = useContext(DocumentViewerContext);

  return (
    <Card fullHeight>
      <DocumentTitle />
      <Container>
        <StyledLoader size="3xlarge" />
        <PDF {...dokument} />
      </Container>
    </Card>
  );
};

const PDF = ({ journalpostId, dokumentInfoId, tittel: title }: IViewedDocument) => {
  const url = `${KABIN_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;

  return (
    <StyledObject
      data={`${url}#toolbar=0&view=fitH&zoom=page-width`}
      role="document"
      type="application/pdf"
      name={title ?? DEFAULT_NAME}
    />
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  border-radius: 4px;
  background-color: var(--a-surface-neutral-subtle);
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
