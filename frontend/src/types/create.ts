import { IPartId } from './common';

interface CreateBasePayload {
  mottattKlageinstans: string; // LocalDate
  fristInWeeks: number; // Number of weeks
  klager: IPartId | null;
  fullmektig: IPartId | null;
  avsender: IPartId | null;
}

export interface CreateAnkeApiPayload extends CreateBasePayload {
  klagebehandlingId: string;
  ankeDocumentJournalpostId: string;
}

export interface CreateKlageApiPayload extends CreateBasePayload {
  sakId: string;
  klageJournalpostId: string;
  mottattVedtaksinstans: string; // LocalDate
  ytelseId: string;
  hjemmelIdList: string[];
}

export interface CreateResponse {
  mottakId: string;
}
