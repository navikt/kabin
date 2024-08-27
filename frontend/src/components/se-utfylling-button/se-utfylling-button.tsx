import { DocPencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { Link } from 'react-router-dom';

interface Props {
  registreringId: string;
}

export const SeUtfylling = ({ registreringId }: Props) => (
  <Button
    as={Link}
    to={`/registrering/${registreringId}`}
    variant="secondary"
    size="small"
    icon={<DocPencilIcon aria-hidden role="presentation" />}
  >
    Se utfylling
  </Button>
);
