import { GlassesFillIcon, GlassesIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useViewDocument } from './use-view-document';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string | null;
  harTilgangTilArkivvariant: boolean;
}

export const ViewDocumentButton = (props: Props) => {
  const [viewDocument, isViewed] = useViewDocument(props);

  return (
    <StyledButton
      size="small"
      variant="tertiary-neutral"
      title={isViewed ? 'Åpnet' : 'Åpne dokument'}
      onMouseDown={viewDocument}
      aria-pressed={isViewed}
      aria-controls="document-viewer"
      icon={isViewed ? <GlassesFillIcon /> : <GlassesIcon />}
    />
  );
};

const StyledButton = styled(Button)`
  grid-area: view;
`;
