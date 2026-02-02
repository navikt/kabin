import { Checkbox } from '@navikt/ds-react';
import { type JSX, useEffect, useRef } from 'react';

interface FilterProps<T extends string> {
  onChange: (id: T, active: boolean) => void;
  active: boolean;
  filterId: T;
  children: string;
  focused: boolean;
}

export const Filter = <T extends string>({
  active,
  filterId,
  children,
  onChange,
  focused,
}: FilterProps<T>): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [focused]);

  return (
    <Checkbox
      className="w-full overflow-hidden text-ellipsis"
      data-testid="filter"
      data-filterid={filterId}
      data-label={children}
      type="checkbox"
      checked={active}
      onChange={({ target }) => onChange(filterId, target.checked)}
      size="small"
      ref={ref}
      title={children}
    >
      <span title={children}>{children}</span>
    </Checkbox>
  );
};

Filter.displayName = 'Filter';
