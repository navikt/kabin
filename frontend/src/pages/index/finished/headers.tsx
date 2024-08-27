import { Table } from '@navikt/ds-react';

export const FinishedHeaders = () => (
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader colSpan={2}>Saken gjelder</Table.ColumnHeader>

      <Table.ColumnHeader sortKey="typeId" sortable>
        Type
      </Table.ColumnHeader>

      <Table.ColumnHeader sortKey="ytelseId" sortable>
        Ytelse
      </Table.ColumnHeader>

      <Table.ColumnHeader sortKey="created" sortable>
        Opprettet
      </Table.ColumnHeader>

      <Table.ColumnHeader sortKey="finished" sortable>
        Fullført
      </Table.ColumnHeader>

      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>
);
