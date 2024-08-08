import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { IAddress, IPart, RegistreringType } from '@app/types/common';
import { FagsystemId } from '@app/types/mulighet';
import { HandlingEnum } from '@app/types/receiver';

export interface BaseRegistrering {
  id: string;
  sakenGjelderValue: string | null;
  journalpostId: string | null;
  typeId: RegistreringType | null; // Samme type-IDer som i Kodeverket.
  mulighet: MulighetId | null;
  willCreateNewJournalpost: boolean;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
  /** When the registration was finished. `null` if not finished.
   * @type: DateTime | null
   */
  finished: string | null;
  behandlingId: string | null;
  created: string;
  modified: string;
  createdBy: string;
}

export interface DraftRegistrering extends BaseRegistrering {
  finished: null;
  behandlingId: null;
}

export interface FinishedRegistrering extends BaseRegistrering {
  typeId: RegistreringType; // Samme type-IDer som i Kodeverket.
  /** When the registration was finished.
   * @type: DateTime
   */
  finished: string;
  behandlingId: string;
}

export type Registrering = DraftRegistrering | FinishedRegistrering;

export const isDraftRegistrering = (registrering: Registrering): registrering is DraftRegistrering =>
  registrering.finished === null;

export interface Behandlingstid {
  units: number;
  unitTypeId: BehandlingstidUnitType;
}

export interface Overstyringer {
  mottattVedtaksinstans: string | null; // Date, ikke relevant for anke
  mottattKlageinstans: string | null; // Date
  behandlingstid: Behandlingstid | null;
  calculatedFrist: string | null;
  hjemmelIdList: string[] | null;
  ytelseId: string | null;
  fullmektig: IPart | null;
  klager: IPart | null;
  avsender: IPart | null;
  /** NAV ident */
  saksbehandlerIdent: string | null;
  /** Gosys-oppgave */
  oppgaveId: number | null;
}

export interface Svarbrev {
  send: boolean | null;
  overrideBehandlingstid: boolean;
  behandlingstid: Behandlingstid | null;
  calculatedFrypiist: string | null;
  fullmektigFritekst: string | null;
  receivers: Receiver[];
  title: string; // default DEFAULT_SVARBREV_NAME
  overrideCustomText: boolean;
  customText: string | null;
}

export interface Receiver {
  id: string;
  part: IPart;
  handling: HandlingEnum;
  overriddenAddress: IAddress | null;
}

export interface MulighetId {
  id: string;
  originalFagsystemId: string;
  currentFagsystemId: FagsystemId;
}
