import { SortState } from '@navikt/ds-react';
import { useMemo } from 'react';
import {
  DraftRegistrering,
  FinishedRegistrering,
  FinishingRegistrering,
  Overstyringer,
  Registrering,
} from '@app/redux/api/registreringer/types';
import { useSimpleYtelser } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum } from '@app/types/common';
import { IKodeverkSimpleValue } from '@app/types/kodeverk';
import { TYPE_NAME } from '@app/types/mulighet';

export const ROWS_PER_PAGE = 10;

type SortProp =
  | keyof Pick<Registrering, 'typeId' | 'modified' | 'created'>
  | keyof Pick<Overstyringer, 'ytelseId'>
  | keyof Pick<FinishedRegistrering, 'finished'>;
const isSortProp = (key: string): key is SortProp =>
  ['typeId', 'modified', 'created', 'ytelseId', 'finished'].includes(key);

export const useSort = <T extends DraftRegistrering | FinishedRegistrering | FinishingRegistrering>(
  registreringer: T[],
  sort: SortState | undefined,
  page: number,
): T[] => {
  const { data: ytelser = [] } = useSimpleYtelser();

  return useMemo(
    () =>
      registreringer
        .toSorted((a, b) => {
          if (sort === undefined || sort.direction === 'none' || !isSortProp(sort.orderBy)) {
            return 0;
          }

          const [aVal, bVal] = getValues(a, b, sort.orderBy, ytelser);

          return sort.direction === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        })
        .slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [registreringer, page, sort, ytelser],
  );
};

const getValues = (
  a: Registrering,
  b: Registrering,
  sortBy: SortProp,
  ytelser: IKodeverkSimpleValue[],
): [string, string] => {
  switch (sortBy) {
    case 'typeId':
      return getSakstypeNames(a, b);
    case 'ytelseId':
      return getYtelseNames(a, b, ytelser);
    default:
      return [a[sortBy] ?? '', b[sortBy] ?? ''];
  }
};

const getSakstypeName = (typeId: SaksTypeEnum | null): string => {
  if (typeId === null) {
    return '';
  }

  return TYPE_NAME[typeId];
};

const getSakstypeNames = (a: Registrering, b: Registrering): [string, string] => [
  getSakstypeName(a.typeId),
  getSakstypeName(b.typeId),
];

const getYtelseNames = (a: Registrering, b: Registrering, ytelser: IKodeverkSimpleValue[]): [string, string] => [
  a.overstyringer.ytelseId === null ? 'Ingen' : (ytelser.find((y) => y.id === a.overstyringer.ytelseId)?.navn ?? ''),
  b.overstyringer.ytelseId === null ? 'Ingen' : (ytelser.find((y) => y.id === b.overstyringer.ytelseId)?.navn ?? ''),
];
