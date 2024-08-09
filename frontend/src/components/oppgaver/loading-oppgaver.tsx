import { Skeleton, Table } from '@navikt/ds-react';
import { Card } from '@app/components/card/card';

interface Props {
  header?: React.ReactNode;
  tableHeaders?: React.ReactNode;
}

export const LoadingOppgaver = ({ header, tableHeaders }: Props) => (
  <Card>
    {header}
    <Table size="small">
      {tableHeaders}
      <Table.Body>
        <Table.Row>
          <Table.DataCell>
            <Skeleton width={32} />
          </Table.DataCell>
          <Table.DataCell>
            <Skeleton />
          </Table.DataCell>
          <Table.DataCell>
            <Skeleton />
          </Table.DataCell>
          <Table.DataCell>
            <Skeleton />
          </Table.DataCell>
          <Table.DataCell>
            <Skeleton />
          </Table.DataCell>
          <Table.DataCell>
            <Skeleton />
          </Table.DataCell>
          <Table.DataCell>
            <Skeleton />
          </Table.DataCell>
          <Table.DataCell>
            <Skeleton />
          </Table.DataCell>
          <Table.DataCell>
            <Skeleton width={32} />
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Card>
);
