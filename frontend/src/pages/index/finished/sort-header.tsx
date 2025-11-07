import { ArrowsUpDownIcon, SortDownIcon, SortUpIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, type SortState, Table, type TableProps } from '@navikt/ds-react';

interface Props {
  sortKey: string;
  children: React.ReactNode;
  orderBy: string;
  direction: SortState['direction'];
  onSortChange: TableProps['onSortChange'];
}

export const SortHeader = ({ sortKey, orderBy, direction, ...rest }: Props) => (
  <Table.HeaderCell aria-sort={getAriaSort(sortKey, orderBy, direction)}>
    <SortButton sortKey={sortKey} orderBy={orderBy} direction={direction} {...rest} />
  </Table.HeaderCell>
);

const getAriaSort = (sortKey: string, orderBy: string, direction: SortState['direction']): SortState['direction'] => {
  if (orderBy !== sortKey) {
    return 'none';
  }

  return direction;
};

interface SortButtonProps extends Props {
  className?: string;
  size?: ButtonProps['size'];
}

const SortButton = ({ sortKey, children, orderBy, direction, onSortChange, className, size }: SortButtonProps) => (
  <Button
    variant={orderBy === sortKey ? 'primary-neutral' : 'tertiary-neutral'}
    size={size}
    onClick={() => onSortChange?.(sortKey)}
    icon={<SortIcon sortKey={sortKey} orderBy={orderBy} direction={direction} />}
    className={className}
    iconPosition="right"
  >
    {children}
  </Button>
);

interface SortIconProps {
  sortKey: string;
  orderBy: string;
  direction: SortState['direction'];
}

const SortIcon = ({ sortKey, orderBy, direction }: SortIconProps) => {
  if (orderBy !== sortKey) {
    return <ArrowsUpDownIcon aria-hidden role="presentation" />;
  }

  if (direction === 'ascending') {
    return <SortUpIcon aria-hidden role="presentation" />;
  }

  return <SortDownIcon aria-hidden role="presentation" />;
};
