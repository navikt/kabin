import { Skeleton, Table } from '@navikt/ds-react';
import React from 'react';
import { Card } from '@app/components/card/card';
import { Header } from './header';
import { TableHeaders } from './table-headers';

export const SkeletonTable = () => (
  <Card>
    <Header />
    <Table size="small">
      <TableHeaders />
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
