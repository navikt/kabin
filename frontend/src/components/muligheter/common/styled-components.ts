import { Table } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const TableContainer = styled.div<{ $showShadow: boolean }>`
  overflow-y: auto;

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    display: ${({ $showShadow }) => ($showShadow ? 'block' : 'none')};
    height: 15px;
    width: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0), #fff);
  }
`;

export const StyledTableHeader = styled(Table.Header)`
  position: sticky;
  top: 0;
  background: #fff;
  box-shadow: 0 5px 5px -5px #000;
  z-index: 1;
`;

export const StyledButtonCell = styled(Table.DataCell)`
  text-align: center;
`;

export const StyledTableRow = styled(Table.Row)<{ $isValid: boolean; $isSelected: boolean }>`
  cursor: ${({ $isValid }) => ($isValid ? 'pointer' : 'default')};
  background-color: ${({ $isValid, $isSelected }) =>
    !$isValid && $isSelected ? 'var(--a-surface-danger-subtle)' : 'none'};
  border-radius: 4px;

  &&&:hover {
    background-color: ${({ $isValid, $isSelected }) =>
      !$isValid && $isSelected ? 'var(--a-surface-danger-subtle-hover)' : 'none'};
  }
`;
