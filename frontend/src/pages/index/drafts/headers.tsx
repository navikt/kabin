import { Table } from '@navikt/ds-react';

export const DraftsHeaders = () => (
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader colSpan={2}>Saken gjelder</Table.ColumnHeader>

      <Table.ColumnHeader sortKey="typeId" sortable>
        Type
      </Table.ColumnHeader>

      <Table.HeaderCell>Ytelse</Table.HeaderCell>

      <Table.ColumnHeader sortKey="created" sortable>
        Opprettet
      </Table.ColumnHeader>

      <Table.ColumnHeader sortKey="modified" sortable>
        Sist endret
      </Table.ColumnHeader>

      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>
);
