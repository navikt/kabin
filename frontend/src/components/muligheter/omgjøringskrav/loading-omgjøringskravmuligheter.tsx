import { ValidationFieldNames } from '@app/types/validation';
import { Skeleton, Table } from '@navikt/ds-react';
import type React from 'react';

export const LoadingOmgjøringskravMuligheter = ({ children }: { children?: React.ReactNode }) => (
  <Table size="small" id={ValidationFieldNames.MULIGHET} aria-label="Omgjøringskravmuligheter">
    {children}
    <Table.Body>
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
    </Table.Body>
  </Table>
);

const LoadingRow = () => (
  <Table.Row>
    <Table.DataCell>
      <Skeleton height={32} width={50} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={80} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={120} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={120} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={100} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={120} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={80} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={50} />
    </Table.DataCell>
  </Table.Row>
);
