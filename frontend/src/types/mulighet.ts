import { IPart, ISaksbehandler } from '@app/types/common';
import { Ytelse } from '@app/types/ytelse';
import { UtfallEnum } from './kodeverk';

interface IBasemulighet {
  fagsakId: string;
  fagsystemId: string;
  sakenGjelder: IPart;
  utfallId: UtfallEnum;
  temaId: string;
}

export interface IKlagemulighet extends IBasemulighet {
  behandlingId: string;
  klageBehandlendeEnhet: string;
  vedtakDate: string;
}

export interface IAnkeMulighet extends IBasemulighet {
  id: string;
  ytelseId: Ytelse | null;
  hjemmelId: string | null;
  klager: IPart;
  fullmektig: IPart | null;
  previousSaksbehandler: ISaksbehandler | null;
  sourceId: string;
  vedtakDate: string | null;
  typeId: TypeId;
  sourceOfExistingAnkebehandling: ExistingAnkebehandling[];
}

interface ExistingAnkebehandling {
  /** UUID */
  id: string;
  /** LocalDateTime */
  created: string;
  /** LocalDateTime */
  completed: string | null;
}

export enum TypeId {
  KLAGE = '1',
  ANKE = '2',
  ANKE_I_TR = '3',
}
