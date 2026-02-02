import { Table } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';

interface Props extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'onClick'> {
  path: string;
  children: React.ReactNode;
}

export const TableRow = ({ path, children, ...props }: Props) => {
  const navigate = useNavigate();

  return (
    <Table.Row className="cursor-pointer" {...props} onClick={() => navigate(path)}>
      {children}
    </Table.Row>
  );
};
