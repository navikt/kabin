import { IPartId } from './common';

interface CreateBasePayload {
  id: string | null;
  avsender: IPartId | null;
  fristInWeeks: number | null; // Number of weeks
  fullmektig: IPartId | null;
  journalpostId: string | null;
  klager: IPartId | null;
  mottattKlageinstans: string | null; // LocalDate
  ytelseId: string | null;
  hjemmelId: string | null;
  saksbehandlerIdent: string | null;
}

export interface CreateAnkeApiPayload extends CreateBasePayload {
  sourceId: string;
}

export interface CreateKlageApiPayload extends CreateBasePayload {
  mottattVedtaksinstans: string | null; // LocalDate
}

export interface CreateResponse {
  mottakId: string;
}
