import { Edit, ExternalLink } from '@navikt/ds-icons';
import { Button, Heading } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePrevious } from '../../hooks/use-previous';
import { DocumentViewerContext } from '../../pages/create/document-viewer-context';
import { EditTitle } from './edit-document-title';

interface Props {
  url: string;
}

export const DocumentTitle = ({ url }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const { dokument } = useContext(DocumentViewerContext);
  const previous = usePrevious(dokument);

  useEffect(() => {
    if (dokument !== previous) {
      setEditMode(false);
    }
  }, [dokument, previous]);

  if (dokument === null) {
    return null;
  }

  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <StyledDocumentTitle>
      <Button
        as="a"
        variant="tertiary"
        icon={<ExternalLink title="Åpne i nytt vindu" />}
        size="small"
        href={url}
        target="_blank"
        rel="noreferrer"
      />
      <ViewTitle show={!editMode} toggleEditMode={toggleEditMode} />
      <EditTitle show={editMode} toggleEditMode={toggleEditMode} />
    </StyledDocumentTitle>
  );
};

interface TitleProps {
  show: boolean;
  toggleEditMode: () => void;
}

const ViewTitle = ({ show, toggleEditMode }: TitleProps) => {
  const { dokument } = useContext(DocumentViewerContext);

  if (!show) {
    return null;
  }

  return (
    <>
      <StyledHeading size="small" level="1">
        {dokument?.tittel ?? ''}
      </StyledHeading>
      <Button variant="tertiary" icon={<Edit title="Endre dokumenttittel" />} size="small" onClick={toggleEditMode} />
    </>
  );
};

const StyledHeading = styled(Heading)`
  width: 100%;
  flex-grow: 1;
`;

const StyledDocumentTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
`;
