import { IAvsenderMottaker } from '@app/types/dokument';

export const formatAvsenderMottaker = (avsenderMottaker: IAvsenderMottaker | null): string => {
  if (avsenderMottaker === null) {
    return 'Ingen';
  }
  const { navn, id } = avsenderMottaker;

  return navn ?? id ?? 'Ukjent';
};
