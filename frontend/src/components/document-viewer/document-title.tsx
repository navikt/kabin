import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';

interface Props {
  url: string;
}

export const DocumentTitle = ({ url }: Props) => {
  const { dokument } = useContext(DocumentViewerContext);

  if (dokument === null) {
    return null;
  }

  return (
    <StyledDocumentTitle>
      <Button
        as="a"
        variant="tertiary"
        icon={<ExternalLinkIcon title="Åpne i nytt vindu" />}
        size="small"
        href={url}
        target="_blank"
        rel="noreferrer"
      />
      <StyledHeading size="small" level="1">
        {dokument?.tittel ?? ''}
      </StyledHeading>
    </StyledDocumentTitle>
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
