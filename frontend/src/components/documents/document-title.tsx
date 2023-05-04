import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';
import { EditTitle } from './edit-document-title';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
}

export const DocumentTitle = ({ dokumentInfoId, journalpostId, tittel }: Props) => {
  const { dokument } = useContext(DocumentViewerContext);
  const [editMode, setEditMode] = useState(false);

  const isActive = useMemo(
    () => dokument !== null && dokument.dokumentInfoId === dokumentInfoId && dokument.journalpostId === journalpostId,
    [dokumentInfoId, journalpostId, dokument]
  );

  const enterEditMode = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditMode(true);
  }, []);

  if (!editMode) {
    return (
      <StyledTitle>
        <EllipsisTitle title={tittel} data-testid="document-title" $isActive={isActive}>
          {tittel}
        </EllipsisTitle>
        <Button
          size="xsmall"
          variant="tertiary"
          icon={<PencilIcon aria-hidden />}
          title="Endre"
          onClick={enterEditMode}
        />
      </StyledTitle>
    );
  }

  return (
    <StyledTitle>
      <EditTitle
        dokumentInfoId={dokumentInfoId}
        journalpostId={journalpostId}
        exitEditMode={() => setEditMode(false)}
        title={tittel}
      />
    </StyledTitle>
  );
};

const StyledTitle = styled.div`
  grid-area: title;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  flex-grow: 1;
  overflow: hidden;
  column-gap: 8px;
  padding-left: var(--a-spacing-2);
  height: 32px;
`;

const EllipsisTitle = styled.div<{ $isActive: boolean }>`
  user-select: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
`;
