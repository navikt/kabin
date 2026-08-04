import type { InngaaendeKanal } from '@app/redux/api/registreringer/types';
import type { RegistreringType } from '@app/types/common';
import type {
  IAdditionalKabalMulighet,
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

export interface SetAdditionalKabalMulighetParams {
  id: string;
  mulighet: IAdditionalKabalMulighet;
}

export interface SearchPartWithUtsendingskanalParams {
  identifikator: string;
  sakenGjelderId: string;
  ytelseId: string;
}

interface CreateDokumentUploadDocument {
  contentType: string;
  name: string;
}

export interface CreateDokumentUploadsParams {
  id: string;
  documents: CreateDokumentUploadDocument[];
}

export interface SetDokumentSortIndexParams {
  id: string;
  dokumentId: string;
  sortIndex: number;
}

export interface SetInngaaendeKanalParams {
  id: string;
  inngaaendeKanal: InngaaendeKanal;
}

export interface SetDokumentNameParams {
  id: string;
  dokumentId: string;
  name: string;
}

export interface DeleteDokumentParams {
  id: string;
  dokumentId: string;
}

export interface ResetDokumentStatusParams {
  id: string;
  dokumentIds: string[];
}
