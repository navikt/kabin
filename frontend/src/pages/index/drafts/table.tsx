import { BodyShort, Pagination, SortState, Table } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { DraftsHeaders } from '@app/pages/index/drafts/headers';
import { DraftRow } from '@app/pages/index/drafts/row';
import { TableAndPagination } from '@app/pages/index/styled-components';
import { DraftRegistrering } from '@app/redux/api/registreringer/types';
import { ROWS_PER_PAGE, useSort } from './use-sort';

interface RegistreringerTableProps {
  registreringer: DraftRegistrering[];
}

export const DraftsTable = ({ registreringer }: RegistreringerTableProps) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | undefined>();
  const numberOfPages = useMemo(() => Math.ceil(registreringer.length / ROWS_PER_PAGE), [registreringer]);
  const sorted = useSort(registreringer, sort, page);

  const handleSort = (sortKey?: string) => {
    if (sortKey === undefined) {
      return setSort(undefined);
    }

    setSort({ orderBy: sortKey, direction: sort?.direction === 'ascending' ? 'descending' : 'ascending' });
  };

  if (registreringer.length === 0) {
    return <BodyShort>Ingen påbegynte registreringer</BodyShort>;
  }

  return (
    <TableAndPagination>
      <Table zebraStripes size="small" sort={sort} onSortChange={handleSort}>
        <DraftsHeaders />

        <Table.Body>
          {sorted.map((r) => (
            <DraftRow key={r.id} registrering={r} />
          ))}
        </Table.Body>
      </Table>
      <Pagination page={page} onPageChange={setPage} count={numberOfPages} size="small" />
    </TableAndPagination>
  );
};
