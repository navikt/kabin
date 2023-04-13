import { IPartId } from './common';

export interface CreateAnkeApiPayload {
  klagebehandlingId: string;
  mottattNav: string; // LocalDate
  fristInWeeks: number; // Number of weeks
  klager: IPartId | null;
  fullmektig: IPartId | null;
  ankeDocumentJournalpostId: string;
  avsender: IPartId | null;
}

export interface CreateKlageApiPayload {
  saksId: string;
  mottattNav: string; // LocalDate
  fristInWeeks: number; // Number of weeks
  klager: IPartId | null;
  fullmektig: IPartId | null;
  klageDocumentJournalpostId: string;
  avsender: IPartId | null;
}

export interface CreateResponse {
  mottakId: string;
}
