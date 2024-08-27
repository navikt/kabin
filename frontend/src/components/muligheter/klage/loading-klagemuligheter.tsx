import { Skeleton, Table } from '@navikt/ds-react';
import React from 'react';
import { ValidationFieldNames } from '@app/types/validation';

export const LoadingKlagemuligheter = ({ children }: { children?: React.ReactNode }) => (
  <Table size="small" id={ValidationFieldNames.MULIGHET} aria-label="Ankemuligheter">
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
      <Skeleton height={32} width={80} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={170} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={120} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={320} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={100} />
    </Table.DataCell>
    <Table.DataCell>
      <Skeleton height={32} width={30} />
    </Table.DataCell>
  </Table.Row>
);
