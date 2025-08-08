import { SortHeader } from '@app/pages/index/finished/sort-header';
import { type SortState, Table, type TableProps } from '@navikt/ds-react';

interface Props {
  sortState: SortState;
  onSortChange: TableProps['onSortChange'];
}

export const FinishedHeaders = ({ sortState, onSortChange }: Props) => {
  const { direction, orderBy } = sortState;
  const common = { direction, orderBy, onSortChange };

  return (
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader colSpan={2}>Saken gjelder</Table.ColumnHeader>

        <SortHeader {...common} sortKey="typeId">
          Type
        </SortHeader>
        <SortHeader {...common} sortKey="ytelseId">
          Ytelse
        </SortHeader>
        <SortHeader {...common} sortKey="created">
          Opprettet
        </SortHeader>
        <SortHeader {...common} sortKey="finished">
          Fullført
        </SortHeader>

        <Table.HeaderCell />
      </Table.Row>
    </Table.Header>
  );
};
