import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { ApiRecipient } from '@app/types/recipient';
import { IPartId, SaksTypeEnum } from './common';

interface SvarbrevBase {
  title: string;
  fullmektigFritekst: string | null;
  varsletBehandlingstidUnits: number;
  varsletBehandlingstidUnitType: BehandlingstidUnitType;
  customText: string | null;
}

export interface SvarbrevPreviewInput extends SvarbrevBase {
  mottattKlageinstans: string;
  sakenGjelder: string;
  ytelseId: string;
  klager: string | null;
  typeId: SaksTypeEnum;
}

export interface SvarbrevInput extends SvarbrevBase {
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
  behandlingstidUnits: number | null;
  behandlingstidUnitType: BehandlingstidUnitType | null;
  fullmektig: IPartId | null;
  journalpostId: string | null;
  klager: IPartId | null;
  mottattKlageinstans: string | null; // LocalDate
  ytelseId: string | null;
  hjemmelIdList: string[];
  saksbehandlerIdent: string | null;
  oppgaveId: number | null;
  svarbrevInput: SvarbrevInput | null;
}

export type CreateAnkeApiPayload = CreateBasePayload;

export interface CreateKlageApiPayload extends CreateBasePayload {
  mottattVedtaksinstans: string | null; // LocalDate
}

export interface CreateResponse {
  behandlingId: string;
}
