import { BodyShort, Pagination, SortState, Table } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { DraftsHeaders } from '@app/pages/index/drafts/headers';
import { DraftRow } from '@app/pages/index/drafts/row';
import { TableAndPagination } from '@app/pages/index/styled-components';
import { DraftRegistrering } from '@app/redux/api/registreringer/types';

const ROWS_PER_PAGE = 10;

type SortProp = keyof Pick<DraftRegistrering, 'typeId' | 'modified' | 'created'>;
const isSortProp = (key: string): key is SortProp => ['typeId', 'modified', 'created'].includes(key);

interface RegistreringerTableProps {
  registreringer: DraftRegistrering[];
}

export const DraftsTable = ({ registreringer }: RegistreringerTableProps) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | undefined>();
  const numberOfPages = useMemo(() => Math.ceil(registreringer.length / ROWS_PER_PAGE), [registreringer]);

  const sorted = useMemo(
    () =>
      registreringer
        .toSorted((a, b) => {
          if (sort === undefined || sort.direction === 'none' || !isSortProp(sort.orderBy)) {
            return 0;
          }

          const aVal = a[sort.orderBy] ?? '';
          const bVal = b[sort.orderBy] ?? '';

          if (sort.direction === 'ascending') {
            return aVal.localeCompare(bVal);
          }

          return bVal.localeCompare(aVal);
        })
        .slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [registreringer, page, sort],
  );

  const handleSort = (sortKey?: string) => {
    if (sortKey === undefined) {
      return setSort(undefined);
    }

    setSort({ orderBy: sortKey, direction: sort?.direction === 'ascending' ? 'descending' : 'ascending' });
  };

  if (registreringer.length === 0) {
    return <BodyShort>Ingen registreringer</BodyShort>;
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
