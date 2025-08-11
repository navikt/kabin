import { FinishedHeaders } from '@app/pages/index/finished/headers';
import { FinishedTable } from '@app/pages/index/finished/table';
import { Container } from '@app/pages/index/styled-components';
import { useGetFerdigeRegistreringerQuery } from '@app/redux/api/registreringer/queries';
import { Heading, Skeleton, type SortState, Table } from '@navikt/ds-react';
import { useState } from 'react';

export const Finished = () => (
  <Container>
    <Heading level="1" size="medium" spacing>
      Ferdige registreringer siste 7 dager
    </Heading>

    <Rows />
  </Container>
);

const Rows = () => {
  const { data, isLoading } = useGetFerdigeRegistreringerQuery();
  const [sortState, setSortState] = useState<SortState>({ direction: 'descending', orderBy: 'finished' });

  const onSortChange = (sortKey: string) =>
    setSortState({ orderBy: sortKey, direction: sortState.direction === 'ascending' ? 'descending' : 'ascending' });

  if (isLoading || data === undefined) {
    return <SkeletonTable sortState={sortState} onSortChange={onSortChange} />;
  }

  return <FinishedTable registreringer={data} sortState={sortState} onSortChange={onSortChange} />;
};

interface SkeletonTableProps {
  sortState: SortState;
  onSortChange: (sortKey: string) => void;
}

const SkeletonTable = ({ sortState, onSortChange }: SkeletonTableProps) => (
  <Table zebraStripes size="small">
    <FinishedHeaders sortState={sortState} onSortChange={onSortChange} />

    <Table.Body>
      <Table.Row>
        <Table.DataCell>
          <Skeleton width={220} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={140} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={52} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={200} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={147} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={147} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={59} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={120} height={32} />
        </Table.DataCell>
      </Table.Row>
    </Table.Body>
  </Table>
);
