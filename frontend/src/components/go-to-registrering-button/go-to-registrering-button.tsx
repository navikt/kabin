import { DocPencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { Link } from 'react-router';

interface Props {
  registreringId: string;
  children?: string;
}

export const GoToRegistrering = ({ registreringId, children = 'Se utfylling' }: Props) => (
  <Button
    data-color="neutral"
    as={Link}
    to={`/registrering/${registreringId}`}
    variant="secondary"
    size="small"
    icon={<DocPencilIcon aria-hidden role="presentation" />}
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    {children}
  </Button>
);
