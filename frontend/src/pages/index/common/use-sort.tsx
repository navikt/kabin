import { useGetSakstyperQuery, useGetSimpleYtelserQuery } from '@app/redux/api/kodeverk';
import type { DraftRegistreringListItem, FinishedRegistreringListItem } from '@app/redux/api/registreringer/types';
import type { SaksTypeEnum } from '@app/types/common';
import type { IKodeverkSimpleValue } from '@app/types/kodeverk';
import type { SortState } from '@navikt/ds-react';
import { useMemo } from 'react';

export const ROWS_PER_PAGE = 10;

type Item = FinishedRegistreringListItem | DraftRegistreringListItem;

type SortKey = keyof FinishedRegistreringListItem | keyof DraftRegistreringListItem;

const isSortProp = (key: string, a: Item, b: Item): key is SortKey => key in a && key in b;

export const useSort = <T extends Item>(registreringer: T[], sort: SortState | undefined, page: number): T[] => {
  const { data: ytelser = [] } = useGetSimpleYtelserQuery();
  const { data: sakstyper = [] } = useGetSakstyperQuery();

  return useMemo(
    () =>
      registreringer
        .toSorted((a, b) => {
          if (sort === undefined || sort.direction === 'none' || !isSortProp(sort.orderBy, a, b)) {
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
  a: Item,
  b: Item,
  sortBy: SortKey,
  ytelser: IKodeverkSimpleValue[],
  sakstyper: IKodeverkSimpleValue[],
): [string, string] => {
  switch (sortBy) {
    case 'typeId':
      return getSakstypeNames(a, b, sakstyper);
    case 'ytelseId':
      return getYtelseNames(a, b, ytelser);
    case 'behandlingId':
    case 'finished':
      return [isFinished(a) ? a[sortBy] : '', isFinished(b) ? b[sortBy] : ''];
    case 'modified':
      return [isFinished(a) ? '' : a.modified, isFinished(b) ? '' : b.modified];
    default:
      return [a[sortBy] ?? '', b[sortBy] ?? ''];
  }
};

const getSakstypeName = (typeId: SaksTypeEnum | null, sakstyper: IKodeverkSimpleValue[]): string => {
  if (typeId === null) {
    return 'Ikke satt';
  }

  return sakstyper.find((s) => s.id === typeId)?.navn ?? '';
};

const getSakstypeNames = (a: Item, b: Item, sakstyper: IKodeverkSimpleValue[]): [string, string] => [
  getSakstypeName(a.typeId, sakstyper),
  getSakstypeName(b.typeId, sakstyper),
];

const getYtelseNames = (a: Item, b: Item, ytelser: IKodeverkSimpleValue[]): [string, string] => [
  a.ytelseId === null ? 'Ingen' : (ytelser.find((y) => y.id === a.ytelseId)?.navn ?? ''),
  b.ytelseId === null ? 'Ingen' : (ytelser.find((y) => y.id === b.ytelseId)?.navn ?? ''),
];

const isFinished = (item: Item): item is FinishedRegistreringListItem => 'finished' in item;
