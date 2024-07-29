import { IPart, ISaksbehandler } from '@app/types/common';
import { Ytelse } from '@app/types/ytelse';

export enum SourceId {
  KABAL = '23',
  INFOTRYGD = '7',
}

interface IBasemulighet {
  readonly id: string;
  readonly fagsakId: string;
  readonly fagsystemId: string;
  readonly sakenGjelder: IPart;
  readonly temaId: string;
  readonly sourceId: SourceId;
}

export interface IKlagemulighet extends IBasemulighet {
  readonly klageBehandlendeEnhet: string;
  readonly vedtakDate: string;
}

export interface IAnkeMulighet extends IBasemulighet {
  readonly ytelseId: Ytelse | null;
  readonly hjemmelIdList: string[];
  readonly klager: IPart;
  readonly fullmektig: IPart | null;
  readonly previousSaksbehandler: ISaksbehandler | null;
  readonly vedtakDate: string | null;
  readonly typeId: TypeId;
  readonly sourceOfExistingAnkebehandling: ExistingAnkebehandling[];
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

export const TYPE_NAME: Record<TypeId, string> = {
  [TypeId.KLAGE]: 'Klage',
  [TypeId.ANKE]: 'Anke',
  [TypeId.ANKE_I_TR]: 'Anke i Trygderetten',
};
