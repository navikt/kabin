import { Button } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  path: string;
}

export const OpenButton = ({ path }: Props) => (
  <Button
    as={RouterLink}
    to={path}
    size="small"
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
  >
    Åpne
  </Button>
);
