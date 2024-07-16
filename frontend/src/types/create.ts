import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { ApiRecipient } from '@app/types/recipient';
import { IPartId, SaksTypeEnum } from './common';

export interface SvarbrevPreviewInput {
  mottattKlageinstans: string;
  sakenGjelder: string;
  ytelseId: string;
  klager: string | null;
  typeId: SaksTypeEnum;
  fullmektigFritekst: string | null;
  varsletBehandlingstidUnits: number;
  varsletBehandlingstidUnitType: BehandlingstidUnitType;
  customText: string | null;
  title: string;
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
  varsletBehandlingstidUnits: number | null;
  varsletBehandlingstidUnitType: BehandlingstidUnitType | null;
  fullmektig: IPartId | null;
  journalpostId: string | null;
  klager: IPartId | null;
  mottattKlageinstans: string | null; // LocalDate
  ytelseId: string | null;
  hjemmelIdList: string[];
  saksbehandlerIdent: string | null;
  oppgaveId: number | null;
}

export interface CreateAnkeApiPayload extends CreateBasePayload {
  svarbrevInput: Nullable<SvarbrevInput> | null;
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface CreateKlageApiPayload extends CreateBasePayload {
  mottattVedtaksinstans: string | null; // LocalDate
}

export interface CreateResponse {
  behandlingId: string;
}
