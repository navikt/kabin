import { IAddress, IPartId } from './common';

export enum HandlingEnum {
  AUTO = 'AUTO',
  LOCAL_PRINT = 'LOCAL_PRINT',
  CENTRAL_PRINT = 'CENTRAL_PRINT',
}

export interface ApiRecipient {
  id: string;
  handling: HandlingEnum;
  overriddenAddress: IAddress | null;
}

export interface SvarbrevPreviewInput {
  title: string;
  fullmektigFritekst: string | null;
}

interface SvarbrevInput extends SvarbrevPreviewInput {
  receivers: ApiRecipient[];
}

export interface CaseVedtak {
  id: string;
  sourceId: string;
  sakenGjelder: IPartId;
}

interface CreateBasePayload {
  vedtak: CaseVedtak | null;
  avsender: IPartId | null;
  fristInWeeks: number | null; // Number of weeks
  fullmektig: IPartId | null;
  journalpostId: string | null;
  klager: IPartId | null;
  mottattKlageinstans: string | null; // LocalDate
  ytelseId: string | null;
  hjemmelIdList: string[];
  saksbehandlerIdent: string | null;
}

export interface CreateAnkeApiPayload extends CreateBasePayload {
  svarbrevInput: SvarbrevInput | null;
}

export interface CreateKlageApiPayload extends CreateBasePayload {
  mottattVedtaksinstans: string | null; // LocalDate
}

export interface CreateResponse {
  behandlingId: string;
}
