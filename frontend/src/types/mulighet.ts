import type { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import type { Ytelse } from '@app/types/ytelse';

export enum FagsystemId {
  KABAL = '23',
  /** @public */
  INFOTRYGD = '7',
}

interface IBasemulighet {
  readonly id: string;
  readonly fagsakId: string;
  readonly sakenGjelder: IPart;
  readonly temaId: string;
  readonly originalFagsystemId: string;
  readonly currentFagsystemId: FagsystemId;
  readonly requiresGosysOppgave: boolean;
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
  readonly sourceOfExistingBehandlinger: ExistingBehandling[];
}

export interface IOmgjøringskravmulighet extends IAnkemulighet {}

export interface IBegjæringOmGjenopptakMulighet extends IAnkemulighet {}

interface ExistingBehandling {
  /** UUID */
  id: string;
  /** LocalDateTime */
  created: string;
  /** LocalDateTime */
  completed: string | null;
}
