import type {
  FinishedRegistrering,
  Mulighet,
  Overstyringer,
  RegistreringDokument,
  Svarbrev,
  UploadedDocuments,
} from '@app/redux/api/registreringer/types';
import type { BaseResponse } from '@app/redux/api/types';
import type { RegistreringType } from '@app/types/common';

export interface SetTypeResponse extends BaseResponse {
  typeId: RegistreringType | null;
  mulighet: null;
  willCreateNewJournalpost: false;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
}

export interface SetMulighetResponse extends BaseResponse {
  mulighet: Mulighet;
  willCreateNewJournalpost: boolean;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
}

export interface SetAdditionalKabalMulighetResponse {
  id: string;
  additionalMulighetId: string;
  ytelseId: string;
  hjemmelIdList: string[];
}

export type FerdigstiltRegistreringResponse = BaseResponse & Pick<FinishedRegistrering, 'finished' | 'behandlingId'>;

interface DokumentUploadTarget {
  uploadUrl: string;
  fields: Record<string, string>;
  contentType: string;
  maxSize: number;
}

export interface DokumentUpload {
  /** `null` when `dokument.status` is `UNSUPPORTED_TYPE` — the backend flags unsupported content
   * types immediately, without providing anywhere to upload the file's bytes to. */
  upload: DokumentUploadTarget | null;
  dokument: RegistreringDokument;
}

export interface CreateDokumentUploadsResponse {
  uploads: DokumentUpload[];
}

type UploadedDocumentsResponse = Pick<UploadedDocuments, 'dokumenter'>;

export type SetDokumentSortIndexResponse = BaseResponse & { uploadedDocuments: UploadedDocumentsResponse };

export type SetInngaaendeKanalResponse = BaseResponse & {
  uploadedDocuments: Pick<UploadedDocuments, 'inngaaendeKanal'>;
};

export type SetDokumentNameResponse = BaseResponse & { uploadedDocuments: UploadedDocumentsResponse };

export type DeleteDokumentResponse = BaseResponse & { uploadedDocuments: UploadedDocumentsResponse };

export type ResetDokumentStatusResponse = BaseResponse & { uploadedDocuments: Pick<UploadedDocuments, 'dokumenter'> };
