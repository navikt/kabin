import { DraftHeaders } from '@app/pages/index/drafts/headers';
import { DraftsTable } from '@app/pages/index/drafts/table';
import { Container } from '@app/pages/index/layout';
import { useGetUferdigeRegistreringerQuery } from '@app/redux/api/registreringer/queries';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, Heading, Skeleton, type SortState, Table, Tooltip } from '@navikt/ds-react';
import { useState } from 'react';

export const Drafts = () => {
  const { refetch, isFetching } = useGetUferdigeRegistreringerQuery();

  return (
    <Container>
      <Heading level="1" size="medium" spacing className="flex items-center">
        Registreringer under arbeid
        <Tooltip content="Oppdater">
          <Button
            onClick={refetch}
            icon={<ArrowCirclepathIcon aria-hidden />}
            variant="tertiary-neutral"
            loading={isFetching}
          />
        </Tooltip>
      </Heading>

      <Rows />
    </Container>
  );
};

const Rows = () => {
  const { data, isFetching, isError, isSuccess } = useGetUferdigeRegistreringerQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [sortState, setSortState] = useState<SortState>({ direction: 'descending', orderBy: 'created' });

  const onSortChange = (sortKey: string) =>
    setSortState({ orderBy: sortKey, direction: sortState.direction === 'ascending' ? 'descending' : 'ascending' });

  if (isFetching) {
    return <SkeletonTable sortState={sortState} onSortChange={onSortChange} />;
  }

  if (isError) {
    return <ErrorMessage>Feil ved henting av registreringer under arbeid</ErrorMessage>;
  }

  if (isSuccess) {
    return <DraftsTable registreringer={data} sortState={sortState} onSortChange={onSortChange} />;
  }

  return null;
};

interface SkeletonTableProps {
  sortState: SortState;
  onSortChange: (sortKey: string) => void;
}

const SkeletonTable = ({ sortState, onSortChange }: SkeletonTableProps) => (
  <Table zebraStripes size="small">
    <DraftHeaders sortState={sortState} onSortChange={onSortChange} />

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
