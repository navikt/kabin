import { ROWS_PER_PAGE, useSort } from '@app/pages/index/common/use-sort';
import { DraftHeaders } from '@app/pages/index/drafts/headers';
import { DraftRow } from '@app/pages/index/drafts/row';
import { TableAndPagination } from '@app/pages/index/layout';
import type { DraftRegistreringListItem } from '@app/redux/api/registreringer/types';
import { InlineMessage, Pagination, type SortState, Table, type TableProps } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

interface RegistreringerTableProps {
  registreringer: DraftRegistreringListItem[];
  sortState: SortState;
  onSortChange: TableProps['onSortChange'];
}

export const DraftsTable = ({ registreringer, sortState, onSortChange }: RegistreringerTableProps) => {
  const [page, setPage] = useState(1);
  const numberOfPages = useMemo(() => Math.ceil(registreringer.length / ROWS_PER_PAGE), [registreringer]);
  const currentPage = Math.max(1, Math.min(page, numberOfPages));

  const sorted = useSort(registreringer, sortState, currentPage);

  if (registreringer.length === 0) {
    return (
      <InlineMessage status="info" size="small">
        Ingen registreringer under arbeid
      </InlineMessage>
    );
  }

  return (
    <TableAndPagination>
      <Table zebraStripes size="small" sort={sortState} onSortChange={onSortChange} className="w-fit whitespace-nowrap">
        <DraftHeaders sortState={sortState} onSortChange={onSortChange} />

        <Table.Body>
          {sorted.map((r) => (
            <DraftRow key={r.id} registrering={r} />
          ))}
        </Table.Body>
      </Table>
      <Pagination page={currentPage} onPageChange={setPage} count={numberOfPages} size="small" />
    </TableAndPagination>
  );
};
