import type { IAvsenderMottaker } from '@app/types/common';

export const formatAvsenderMottaker = (avsenderMottaker: IAvsenderMottaker | null): string => {
  if (avsenderMottaker === null) {
    return 'Ingen';
  }
  const { name: navn, id } = avsenderMottaker;

  return navn ?? id ?? 'Ukjent';
};
