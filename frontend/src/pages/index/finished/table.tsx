import { BodyShort, Pagination, SortState, Table } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { FinishedHeaders } from '@app/pages/index/finished/headers';
import { FinishedRow } from '@app/pages/index/finished/row';
import { TableAndPagination } from '@app/pages/index/styled-components';
import { FinishedRegistrering, FinishingRegistrering } from '@app/redux/api/registreringer/types';

const ROWS_PER_PAGE = 10;

type SortProp = keyof Pick<FinishedRegistrering | FinishingRegistrering, 'typeId' | 'finished' | 'created'>;
const isSortProp = (key: string): key is SortProp => ['typeId', 'finished', 'created'].includes(key);

interface RegistreringerTableProps {
  registreringer: (FinishedRegistrering | FinishingRegistrering)[];
}

export const FinishedTable = ({ registreringer }: RegistreringerTableProps) => {
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
