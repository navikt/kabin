import { IPart, ISaksbehandler } from '@app/types/common';
import { Ytelse } from '@app/types/ytelse';

export enum SourceId {
  KABAL = '23',
  INFOTRYGD = '7',
}

interface IBasemulighet {
  id: string;
  fagsakId: string;
  fagsystemId: string;
  sakenGjelder: IPart;
  temaId: string;
  sourceId: SourceId;
}

export interface IKlagemulighet extends IBasemulighet {
  klageBehandlendeEnhet: string;
  vedtakDate: string;
}

export interface IAnkeMulighet extends IBasemulighet {
  ytelseId: Ytelse | null;
  hjemmelIdList: string[];
  klager: IPart;
  fullmektig: IPart | null;
  previousSaksbehandler: ISaksbehandler | null;
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
