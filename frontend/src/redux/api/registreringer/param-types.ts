import type { RegistreringType } from '@app/types/common';
import type { IAnkemulighet, IKlagemulighet } from '@app/types/mulighet';

export interface CreateRegistreringParams {
  sakenGjelderValue: string | null;
}

export interface SetTypeParams {
  id: string;
  typeId: RegistreringType | null;
}

export interface SetKlagemulighetParams {
  id: string;
  mulighet: IKlagemulighet;
}

export interface SetAnkemulisghetParams {
  id: string;
  mulighet: IAnkemulighet;
}

export interface SearchPartWithUtsendingskanalParams {
  identifikator: string;
  sakenGjelderId: string;
  ytelseId: string;
}
