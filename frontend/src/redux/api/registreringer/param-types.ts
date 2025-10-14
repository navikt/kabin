import type { RegistreringType } from '@app/types/common';
import type {
  IAnkemulighet,
  IBegjæringOmGjenopptakMulighet,
  IKlagemulighet,
  IOmgjøringskravmulighet,
} from '@app/types/mulighet';

export interface CreateRegistreringParams {
  sakenGjelderValue: string | null;
}

export interface SetTypeParams {
  id: string;
  typeId: RegistreringType | null;
}

export interface SetAnkemulighetParams {
  id: string;
  mulighet: IAnkemulighet;
}

export interface SetNonAnkemulighetParams {
  id: string;
  mulighet: IKlagemulighet | IOmgjøringskravmulighet | IBegjæringOmGjenopptakMulighet;
}

export interface SearchPartWithUtsendingskanalParams {
  identifikator: string;
  sakenGjelderId: string;
  ytelseId: string;
}
