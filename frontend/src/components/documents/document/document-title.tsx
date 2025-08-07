import { DocumentWarnings } from '@app/components/documents/document/document-warnings';
import { EditTitle } from '@app/components/documents/document/edit-document-title';
import { DocumentViewerContext, type ViewedVedlegg } from '@app/pages/registrering/document-viewer-context';
import type { IArkivertDocument } from '@app/types/dokument';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  dokument: IArkivertDocument | ViewedVedlegg;
}

export const DocumentTitle = ({ dokument }: Props) => {
  const { dokumentInfoId, journalpostId, varianter } = dokument;
  const tittel = dokument.tittel ?? 'Ukjent dokumentnavn';
  const { dokument: viewed } = useContext(DocumentViewerContext);
  const [editMode, setEditMode] = useState(false);

  const isActive = useMemo(
    () => viewed !== null && viewed.dokumentInfoId === dokumentInfoId && viewed.journalpostId === journalpostId,
    [dokumentInfoId, journalpostId, viewed],
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

        <DocumentWarnings varianter={varianter} />

        <Button
          size="xsmall"
          variant="tertiary-neutral"
          icon={<PencilIcon aria-hidden />}
          title="Endre"
          onClick={enterEditMode}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </StyledTitle>
    );
  }

  return (
    <StyledTitle>
      <EditTitle exitEditMode={() => setEditMode(false)} dokument={{ ...dokument, journalpostId }} />
    </StyledTitle>
  );
};

const StyledTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  overflow: hidden;
  column-gap: 4px;
  height: 32px;
`;

const EllipsisTitle = styled.div<{ $isActive: boolean }>`
  user-select: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
`;
