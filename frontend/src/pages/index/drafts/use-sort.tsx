import { useGetSakstyperQuery, useGetSimpleYtelserQuery } from '@app/redux/api/kodeverk';
import type { FinishedRegistreringListItem } from '@app/redux/api/registreringer/types';
import type { SaksTypeEnum } from '@app/types/common';
import type { IKodeverkSimpleValue } from '@app/types/kodeverk';
import type { SortState } from '@navikt/ds-react';
import { useMemo } from 'react';

export const ROWS_PER_PAGE = 10;

type SortProp = keyof FinishedRegistreringListItem;

const isSortProp = (key: string): key is SortProp =>
  ['typeId', 'modified', 'created', 'ytelseId', 'finished'].includes(key);

export const useSort = (
  registreringer: FinishedRegistreringListItem[],
  sort: SortState | undefined,
  page: number,
): FinishedRegistreringListItem[] => {
  const { data: ytelser = [] } = useGetSimpleYtelserQuery();
  const { data: sakstyper = [] } = useGetSakstyperQuery();

  return useMemo(
    () =>
      registreringer
        .toSorted((a, b) => {
          if (sort === undefined || sort.direction === 'none' || !isSortProp(sort.orderBy)) {
            return 0;
          }

          const [aVal, bVal] = getValues(a, b, sort.orderBy, ytelser, sakstyper);

          return sort.direction === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        })
        .slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [registreringer, page, sort, ytelser, sakstyper],
  );
};

const getValues = (
  a: FinishedRegistreringListItem,
  b: FinishedRegistreringListItem,
  sortBy: SortProp,
  ytelser: IKodeverkSimpleValue[],
  sakstyper: IKodeverkSimpleValue[],
): [string, string] => {
  switch (sortBy) {
    case 'typeId':
      return getSakstypeNames(a, b, sakstyper);
    case 'ytelseId':
      return getYtelseNames(a, b, ytelser);
    default:
      return [a[sortBy] ?? '', b[sortBy] ?? ''];
  }
};

const getSakstypeName = (typeId: SaksTypeEnum | null, sakstyper: IKodeverkSimpleValue[]): string => {
  if (typeId === null) {
    return '';
  }

  return sakstyper.find((s) => s.id === typeId)?.navn ?? '';
};

const getSakstypeNames = (
  a: FinishedRegistreringListItem,
  b: FinishedRegistreringListItem,
  sakstyper: IKodeverkSimpleValue[],
): [string, string] => [getSakstypeName(a.typeId, sakstyper), getSakstypeName(b.typeId, sakstyper)];

const getYtelseNames = (
  a: FinishedRegistreringListItem,
  b: FinishedRegistreringListItem,
  ytelser: IKodeverkSimpleValue[],
): [string, string] => [
  a.ytelseId === null ? 'Ingen' : (ytelser.find((y) => y.id === a.ytelseId)?.navn ?? ''),
  b.ytelseId === null ? 'Ingen' : (ytelser.find((y) => y.id === b.ytelseId)?.navn ?? ''),
];
