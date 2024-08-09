import { Skeleton, Table } from '@navikt/ds-react';

const LoadingRow = () => (
  <Table.Row>
    <Table.DataCell>
      <Skeleton height={32} width={180} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={120} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={100} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={150} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={100} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={24} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={24} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={50} />
    </Table.DataCell>
  </Table.Row>
);

export const LoadingDocuments = () => (
  <Table size="small">
    <Table.Body>
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
    </Table.Body>
  </Table>
);
