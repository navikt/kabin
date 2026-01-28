import type { CountryCode } from '@app/static-data/static-data';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface Props {
  country: CountryCode;
  isFocused: boolean;
  isSelected: boolean;
  onClick: (country: CountryCode) => void;
}

export const CountryOption = ({ country, isFocused, isSelected, onClick }: Props) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isFocused && ref.current !== null) {
      ref.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isFocused]);

  return (
    <li key={country.landkode} ref={ref}>
      <Button
        size="small"
        variant={isFocused ? 'primary' : 'tertiary'}
        data-color={isFocused ? undefined : 'neutral'}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onClick(country)}
        icon={isSelected ? <CheckmarkIcon aria-hidden /> : null}
        className="justify-start! w-full"
      >
        {country.land} ({country.landkode})
      </Button>
    </li>
  );
};
