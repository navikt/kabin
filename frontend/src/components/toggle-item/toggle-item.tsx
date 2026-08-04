import { ToggleGroup } from '@navikt/ds-react';
import type { ToggleGroupItemProps } from '@navikt/ds-react/ToggleGroup';

export const ToggleItem = ({ disabled = false, className, ...rest }: ToggleGroupItemProps) => (
  <ToggleGroup.Item
    {...rest}
    disabled={disabled}
    className={disabled ? joinClassNames('cursor-not-allowed', 'opacity-ax-disabled', className) : className}
    data-color={disabled ? 'neutral' : undefined}
  />
);

const joinClassNames = (...classNames: Array<string | undefined>): string =>
  classNames.filter((className): className is string => className !== undefined).join(' ');
