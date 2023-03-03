import { IBehandling } from './behandling';
import { IPart, IPartId, PartType } from './common';
import { IArkivertDocument } from './dokument';

export interface Create {
  klagebehandlingId: string;
  mottattNav: string; // LocalDate
  fristInWeeks: number; // Number of weeks
  klager: IPartId | null;
  fullmektig: IPartId | null;
  ankeDocumentJournalpostId: string;
}

interface Argument {
  klager: IPart | null;
  fullmektig: IPart | null;
  journalpost: IArkivertDocument | null;
  ankemulighet: IBehandling | null;
  mottattNav: string | null;
  fristInWeeks: number;
}

export const getCreatePayload = ({
  klager,
  fullmektig,
  ankemulighet,
  journalpost,
  mottattNav,
  fristInWeeks,
}: Argument): Create | null => {
  if (ankemulighet === null || journalpost === null || mottattNav === null) {
    return null;
  }

  return {
    klagebehandlingId: ankemulighet.behandlingId,
    mottattNav,
    fristInWeeks,
    ankeDocumentJournalpostId: journalpost.journalpostId,
    klager: getPart(klager),
    fullmektig: getPart(fullmektig),
  };
};

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
