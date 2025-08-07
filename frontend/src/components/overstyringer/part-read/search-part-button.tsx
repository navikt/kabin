import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

interface Props {
  enterSearchMode?: () => void;
}

export const SearchPartButton = ({ enterSearchMode }: Props) => {
  if (enterSearchMode === undefined) {
    return null;
  }

  return (
    <Tooltip content="Søk opp part med ID-nummer (f.nr. / org.nr. / ...)">
      <Button
        size="small"
        variant="secondary-neutral"
        icon={<MagnifyingGlassIcon aria-hidden role="presentation" />}
        onClick={enterSearchMode}
      >
        Søk
      </Button>
    </Tooltip>
  );
};
