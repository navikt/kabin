import { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import { Ytelse } from '@app/types/ytelse';

export enum FagsystemId {
  KABAL = '23',
  INFOTRYGD = '7',
}

interface IBasemulighet {
  readonly id: string;
  readonly fagsakId: string;
  readonly sakenGjelder: IPart;
  readonly temaId: string;
  readonly originalFagsystemId: string;
  readonly currentFagsystemId: FagsystemId;
}

export interface IKlagemulighet extends IBasemulighet {
  readonly klageBehandlendeEnhet: string;
  readonly vedtakDate: string;
}

export interface IAnkemulighet extends IBasemulighet {
  readonly ytelseId: Ytelse | null;
  readonly hjemmelIdList: string[];
  readonly klager: IPart;
  readonly fullmektig: IPart | null;
  readonly previousSaksbehandler: ISaksbehandler | null;
  readonly vedtakDate: string | null;
  readonly typeId: SaksTypeEnum;
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

export const TYPE_NAME: Record<SaksTypeEnum, string> = {
  [SaksTypeEnum.KLAGE]: 'Klage',
  [SaksTypeEnum.ANKE]: 'Anke',
  [SaksTypeEnum.ANKE_I_TR]: 'Anke i Trygderetten',
};
