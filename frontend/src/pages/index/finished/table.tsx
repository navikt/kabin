import { ROWS_PER_PAGE, useSort } from '@app/pages/index/drafts/use-sort';
import { FinishedHeaders } from '@app/pages/index/finished/headers';
import { FinishedRow } from '@app/pages/index/finished/row';
import { TableAndPagination } from '@app/pages/index/layout';
import type { FinishedRegistreringListItem } from '@app/redux/api/registreringer/types';
import { Alert, Pagination, type SortState, Table, type TableProps } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

interface RegistreringerTableProps {
  registreringer: FinishedRegistreringListItem[];
  sortState: SortState;
  onSortChange: TableProps['onSortChange'];
}

export const FinishedTable = ({ registreringer, sortState, onSortChange }: RegistreringerTableProps) => {
  const [page, setPage] = useState(1);
  const numberOfPages = useMemo(() => Math.ceil(registreringer.length / ROWS_PER_PAGE), [registreringer]);

  const sorted = useSort(registreringer, sortState, page);

  if (registreringer.length === 0) {
    return (
      <Alert variant="info" inline>
        Ingen fullførte registreringer
      </Alert>
    );
  }

  return (
    <TableAndPagination>
      <Table zebraStripes size="small" sort={sortState} onSortChange={onSortChange} style={{ whiteSpace: 'nowrap' }}>
        <FinishedHeaders sortState={sortState} onSortChange={onSortChange} />

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
