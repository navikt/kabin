import { IPart, ITilknyttetDokument } from '@app/types/common';
import { Ytelse } from '@app/types/ytelse';
import { UtfallEnum } from './kodeverk';

interface IBasemulighet {
  fagsakId: string;
  vedtakDate: string;
  sakenGjelder: IPart;
  fagsystemId: string;
}

export interface IKlagemulighet extends IBasemulighet {
  sakId: string;
  temaId: string;
  klageBehandlendeEnhet: string;
  utfall: string;
}

export interface IAnkeMulighet extends IBasemulighet {
  behandlingId: string;
  ytelseId: Ytelse;
  vedtakDate: string;
  klager: IPart;
  fullmektig: IPart | null;
  utfallId: UtfallEnum;
  tilknyttedeDokumenter: ITilknyttetDokument[];
}
