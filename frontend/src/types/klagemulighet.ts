import { IPart } from '@app/types/common';
import { UtfallEnum } from './kodeverk';

export interface IKlagemulighet {
  sakId: string;
  temaId: string;
  utfall: UtfallEnum;
  vedtakDate: string;
  fagsakId: string;
  fagsystemId: string;
  klageBehandlendeEnhet: string;
  sakenGjelder: IPart;
}
