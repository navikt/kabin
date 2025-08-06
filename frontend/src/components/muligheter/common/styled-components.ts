import { Table } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const StyledTableHeader = styled(Table.Header)`
  position: sticky;
  top: 0;
  background: var(--ax-bg-default);
  box-shadow: var(--ax-shadow-dialog);
  z-index: 1;
`;

export const StyledButtonCell = styled(Table.DataCell)`
  text-align: center;
`;

export const StyledTableRow = styled(Table.Row)<{ $isValid: boolean; $isSelected: boolean; $clickable: boolean }>`
  cursor: ${({ $isValid, $clickable }) => ($isValid && $clickable ? 'pointer' : 'default')};
  background-color: ${({ $isValid, $isSelected }) => (!$isValid && $isSelected ? 'var(--ax-bg-danger-soft)' : 'none')};
  border-radius: 4px;

  &&&:hover {
    background-color: ${({ $isValid, $isSelected }) =>
      !$isValid && $isSelected ? 'var(--ax-bg-danger-moderate-hover)' : 'none'};
  }
`;
