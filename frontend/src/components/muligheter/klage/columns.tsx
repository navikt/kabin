import type { IKlagemulighet } from '@app/types/mulighet';

export const KLAGEMULIGHETER_COLUMNS: (keyof IKlagemulighet)[] = [
  'saksnummer',
  'temaId',
  'vedtakDate',
  'klageBehandlendeEnhet',
  'originalFagsystemId',
];
