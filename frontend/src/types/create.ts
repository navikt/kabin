import { IPartId } from './common';

interface CreateBasePayload {
  avsender: IPartId | null;
  behandlingId: string | null;
  fristInWeeks: number | null; // Number of weeks
  fullmektig: IPartId | null;
  journalpostId: string | null;
  klager: IPartId | null;
  mottattKlageinstans: string | null; // LocalDate
}

export type CreateAnkeApiPayload = CreateBasePayload;

export interface CreateKlageApiPayload extends CreateBasePayload {
  hjemmelIdList: string[];
  mottattVedtaksinstans: string | null; // LocalDate
  ytelseId: string | null;
}

export interface CreateResponse {
  mottakId: string;
}
