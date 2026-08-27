import type { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import type { Ytelse } from '@app/types/ytelse';

export enum FagsystemId {
  KABAL = '23',
  /** @public */
  INFOTRYGD = '7',
}

export interface IBasemulighet {
  readonly id: string;
  readonly fagsakId: string;
  readonly sakenGjelder: IPart;
  readonly temaId: string;
  readonly originalFagsystemId: string;
  readonly currentFagsystemId: FagsystemId;
  readonly requiresGosysOppgave: boolean;
  readonly mulighetTypeId: SaksTypeEnum;
}

export interface IKlagemulighet extends IBasemulighet {
  readonly klageBehandlendeEnhet: string;
  readonly vedtakDate: string;
  readonly mulighetTypeId: SaksTypeEnum.KLAGE;
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
  readonly kjennelseMottatt: string | null;
  readonly mulighetTypeId: SaksTypeEnum.ANKE;
}

export interface IOmgjøringskravmulighet extends Omit<IAnkemulighet, 'mulighetTypeId'> {
  readonly mulighetTypeId: SaksTypeEnum.OMGJØRINGSKRAV;
}

export interface IBegjæringOmGjenopptakMulighet extends Omit<IAnkemulighet, 'mulighetTypeId'> {
  readonly mulighetTypeId: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK;
}

export interface IAdditionalKabalMulighet extends IAnkemulighet {}

export interface ExistingBehandling {
  /** UUID */
  id: string;
  typeId: SaksTypeEnum;
  /** LocalDateTime */
  created: string;
  /** LocalDateTime */
  completed: string | null;
}

// Not klage- or begjæring om gjenopptak-mulighet
export type OtherMulighet = IAnkemulighet | IOmgjøringskravmulighet | IAdditionalKabalMulighet;

/** Every kind of mulighet. Discriminated by `mulighetTypeId`, except `IAdditionalKabalMulighet`,
 * which is indistinguishable from `IAnkemulighet` - see `MulighetType` for that distinction. */
export type IMulighet = IKlagemulighet | OtherMulighet | IBegjæringOmGjenopptakMulighet;
