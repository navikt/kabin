import { IPart, IPartId, PartType } from './common';

export interface Create {
  klagebehandlingId: string;
  mottattNav: string; // LocalDate
  fristInWeeks: number; // Number of weeks
  klager: IPartId | null;
  fullmektig: IPartId | null;
  ankeDocumentJournalpostId: string;
}

interface Argument extends Omit<Create, 'klager' | 'fullmektig'> {
  klager: IPart;
  fullmektig: IPart | null;
}

export const getCreatePayload = ({ klager, fullmektig, ...rest }: Argument): Create => ({
  ...rest,
  klager: getPart(klager),
  fullmektig: getPart(fullmektig),
});

const getPart = (part: IPart | null): IPartId | null => {
  if (part === null) {
    return null;
  }

  if (part.person !== null) {
    return { type: PartType.PERSON, value: part.person.foedselsnummer };
  }

  if (part.virksomhet !== null) {
    return { type: PartType.VIRKSOMHET, value: part.virksomhet.virksomhetsnummer };
  }

  return null;
};

export interface CreateResponse {
  mottakId: string;
}
