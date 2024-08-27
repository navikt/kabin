import { Alert, Pagination, SortState, Table } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { ROWS_PER_PAGE, useSort } from '@app/pages/index/drafts/use-sort';
import { FinishedHeaders } from '@app/pages/index/finished/headers';
import { FinishedRow } from '@app/pages/index/finished/row';
import { TableAndPagination } from '@app/pages/index/styled-components';
import { FinishedRegistreringListItem } from '@app/redux/api/registreringer/types';

interface RegistreringerTableProps {
  registreringer: FinishedRegistreringListItem[];
}

export const FinishedTable = ({ registreringer }: RegistreringerTableProps) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | undefined>({ direction: 'descending', orderBy: 'finished' });
  const numberOfPages = useMemo(() => Math.ceil(registreringer.length / ROWS_PER_PAGE), [registreringer]);

  const sorted = useSort(registreringer, sort, page);

  const handleSort = (sortKey?: string) => {
    if (sortKey === undefined) {
      return setSort(undefined);
    }

    setSort({ orderBy: sortKey, direction: sort?.direction === 'ascending' ? 'descending' : 'ascending' });
  };

  if (registreringer.length === 0) {
    return (
      <Alert variant="info" inline>
        Ingen fullførte registreringer
      </Alert>
    );
  }

  return (
    <TableAndPagination>
      <Table zebraStripes size="small" sort={sort} onSortChange={handleSort} style={{ whiteSpace: 'nowrap' }}>
        <FinishedHeaders />

        <Table.Body>
          {sorted.map((r) => (
            <FinishedRow key={r.id} registrering={r} />
          ))}
        </Table.Body>
      </Table>
      <Pagination page={page} onPageChange={setPage} count={numberOfPages} size="small" />
    </TableAndPagination>
  );
};
