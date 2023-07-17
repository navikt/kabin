import { IPart, ISaksbehandler } from '@app/types/common';
import { Ytelse } from '@app/types/ytelse';
import { UtfallEnum } from './kodeverk';

interface IBasemulighet {
  fagsakId: string;
  fagsystemId: string;
  sakenGjelder: IPart;
  utfallId: UtfallEnum;
  vedtakDate: string;
  temaId: string;
}

export interface IKlagemulighet extends IBasemulighet {
  behandlingId: string;
  klageBehandlendeEnhet: string;
}

export interface IAnkeMulighet extends IBasemulighet {
  id: string;
  ytelseId: Ytelse | null;
  hjemmelId: string | null;
  klager: IPart;
  fullmektig: IPart | null;
  previousSaksbehandler: ISaksbehandler | null;
  sourceId: string;
}
