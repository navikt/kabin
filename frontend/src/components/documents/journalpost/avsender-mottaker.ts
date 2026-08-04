import type { IJournalpostAvsenderMottaker } from '@app/types/dokument';

export const formatAvsenderMottaker = (avsenderMottaker: IJournalpostAvsenderMottaker | null): string => {
  if (avsenderMottaker === null) {
    return 'Ingen';
  }
  const { name, id } = avsenderMottaker;

  return name ?? id;
};
