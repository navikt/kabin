import { useViewDocument } from '@app/components/documents/document/use-view-document';
import { GlassesFillIcon, GlassesIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string | null;
  harTilgangTilArkivvariant: boolean;
}

export const ViewDocumentButton = (props: Props) => {
  const [viewDocument, isViewed] = useViewDocument(props);

  if (!props.harTilgangTilArkivvariant) {
    return null;
  }

  return (
    <Tooltip content={isViewed ? 'Åpnet' : 'Åpne dokumentet'} placement="top">
      <StyledButton
        size="small"
        variant="tertiary-neutral"
        onMouseDown={viewDocument}
        aria-pressed={isViewed}
        aria-controls="document-viewer"
        icon={
          isViewed ? (
            <GlassesFillIcon aria-hidden role="presentation" />
          ) : (
            <GlassesIcon aria-hidden role="presentation" />
          )
        }
      />
    </Tooltip>
  );
};

const StyledButton = styled(Button)`
  grid-area: view;
`;
