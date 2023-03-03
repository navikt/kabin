import { Button } from '@navikt/ds-react';
import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { DocumentViewerContext } from '../../pages/create/document-viewer-context';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
  harTilgangTilArkivvariant: boolean;
}

export const DocumentTitle = ({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant }: Props) => {
  const { dokument, viewDokument } = useContext(DocumentViewerContext);

  const isActive = useMemo(
    () => dokument !== null && dokument.dokumentInfoId === dokumentInfoId && dokument.journalpostId === journalpostId,
    [dokumentInfoId, journalpostId, dokument]
  );

  const onInternalClick = useCallback(
    () => viewDokument(harTilgangTilArkivvariant ? { tittel, dokumentInfoId, journalpostId } : null),
    [viewDokument, harTilgangTilArkivvariant, tittel, dokumentInfoId, journalpostId]
  );

  if (!harTilgangTilArkivvariant) {
    return (
      <StyledTitle>
        <EllipsisTitle title={tittel} data-testid="document-title" $isActive={isActive}>
          {tittel}
        </EllipsisTitle>
      </StyledTitle>
    );
  }

  return (
    <StyledDocumentButton
      onClick={onInternalClick}
      data-testid="document-open-button"
      data-journalpostid={journalpostId}
      data-dokumentinfoid={dokumentInfoId}
      variant="tertiary"
      size="small"
      $isActive={isActive}
    >
      {tittel}
    </StyledDocumentButton>
  );
};

const StyledDocumentButton = styled(Button)<{ $isActive: boolean }>`
  grid-area: title;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  flex-grow: 1;
  cursor: pointer;
  overflow: hidden;
  text-align: left;

  .navds-label {
    user-select: text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
  }
`;

const StyledTitle = styled.div`
  grid-area: title;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  flex-grow: 1;
  overflow: hidden;
`;

const EllipsisTitle = styled.div<{ $isActive: boolean }>`
  user-select: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
  padding: 0.375rem var(--a-spacing-3);
`;
