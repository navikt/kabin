import { IPart, ISaksbehandler } from '@app/types/common';
import { Ytelse } from '@app/types/ytelse';
import { UtfallEnum } from './kodeverk';

interface IBasemulighet {
  behandlingId: string;
  fagsakId: string;
  fagsystemId: string;
  sakenGjelder: IPart;
  utfallId: UtfallEnum;
  vedtakDate: string;
}

export interface IKlagemulighet extends IBasemulighet {
  temaId: string;
  klageBehandlendeEnhet: string;
}

export interface IAnkeMulighet extends IBasemulighet {
  ytelseId: Ytelse;
  klager: IPart;
  fullmektig: IPart | null;
  previousSaksbehandler: ISaksbehandler | null;
}
