import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';

interface Props {
  url: string;
}

export const DocumentTitle = ({ url }: Props) => {
  const { journalpost } = useContext(ApiContext);
  const { dokument } = useContext(DocumentViewerContext);

  if (dokument === null) {
    return null;
  }

  const isSelected = journalpost?.journalpostId === dokument.journalpostId;

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
      <Heading size="small" level="1">
        {dokument?.tittel ?? ''}
      </Heading>
      {isSelected ? <CheckmarkCircleFillIconColored fontSize={28} /> : null}
    </StyledDocumentTitle>
  );
};

const StyledDocumentTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  width: 100%;
`;
