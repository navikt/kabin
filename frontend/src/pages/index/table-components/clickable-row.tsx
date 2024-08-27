import { Table } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

interface Props extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'onClick'> {
  path: string;
  children: React.ReactNode;
}

export const TableRow = ({ path, children, ...props }: Props) => {
  const navigate = useNavigate();

  return (
    <StyledTableRow {...props} onClick={() => navigate(path)}>
      {children}
    </StyledTableRow>
  );
};

const StyledTableRow = styled(Table.Row)`
  cursor: pointer;
`;
