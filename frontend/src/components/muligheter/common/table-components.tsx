import { Box, Table } from '@navikt/ds-react';
import type { ComponentProps } from 'react';

interface StyledTableHeaderProps extends ComponentProps<typeof Table.Header> {}

export const StyledTableHeader = ({ className = '', ...props }: StyledTableHeaderProps) => (
  <Box asChild background="default" shadow="dialog">
    <Table.Header className={`sticky top-0 z-1 ${className}`} {...props} />
  </Box>
);

interface StyledButtonCellProps extends ComponentProps<typeof Table.DataCell> {}

export const StyledButtonCell = ({ className = '', ...props }: StyledButtonCellProps) => (
  <Table.DataCell className={`text-center ${className}`} {...props} />
);

interface StyledTableRowProps extends ComponentProps<typeof Table.Row> {
  isValid: boolean;
  isSelected: boolean;
  clickable: boolean;
}

export const StyledTableRow = ({ isValid, isSelected, clickable, className = '', ...props }: StyledTableRowProps) => {
  const getCursorClass = () => (isValid && clickable ? 'cursor-pointer' : 'cursor-default');
  const getBackgroundClass = () => {
    if (!isValid && isSelected) {
      return 'bg-ax-bg-danger-soft hover:bg-ax-bg-danger-moderate-hover';
    }
    return '';
  };

  return <Table.Row className={`rounded ${getCursorClass()} ${getBackgroundClass()} ${className}`} {...props} />;
};
