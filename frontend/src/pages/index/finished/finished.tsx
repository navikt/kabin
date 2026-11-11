import { FinishedHeaders } from '@app/pages/index/finished/headers';
import { FinishedTable } from '@app/pages/index/finished/table';
import { Container } from '@app/pages/index/layout';
import { useGetFerdigeRegistreringerQuery } from '@app/redux/api/registreringer/queries';
import { GET_FERDIGE_REGISTRERINGER_PARAMS } from '@app/redux/api/registreringer/types';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Heading, Skeleton, type SortState, Table, Tooltip } from '@navikt/ds-react';
import { useState } from 'react';

const FORMATTER = new Intl.NumberFormat('nb-NO');

export const Finished = () => {
  const { refetch } = useGetFerdigeRegistreringerQuery(GET_FERDIGE_REGISTRERINGER_PARAMS);

  return (
    <Container>
      <Heading level="1" size="medium" spacing className="flex items-center">
        Ferdige registreringer siste {FORMATTER.format(GET_FERDIGE_REGISTRERINGER_PARAMS.sidenDager)} dager
        <Tooltip content="Oppdater">
          <Button onClick={refetch} variant="tertiary-neutral" icon={<ArrowCirclepathIcon aria-hidden />} />
        </Tooltip>
      </Heading>

      <Rows />
    </Container>
  );
};

const Rows = () => {
  const { data, isFetching } = useGetFerdigeRegistreringerQuery(GET_FERDIGE_REGISTRERINGER_PARAMS);
  const [sortState, setSortState] = useState<SortState>({ direction: 'descending', orderBy: 'finished' });

  const onSortChange = (sortKey: string) =>
    setSortState({ orderBy: sortKey, direction: sortState.direction === 'ascending' ? 'descending' : 'ascending' });

  if (isFetching || data === undefined) {
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
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </Table.Body>
  </Table>
);

const SkeletonRow = () => (
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
);
