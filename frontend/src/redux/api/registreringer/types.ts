import type { BehandlingstidUnitType } from '@app/types/calculate-frist';
import type { IAddress, IPart, RegistreringType } from '@app/types/common';
import type { IAnkemulighet, IKlagemulighet, IOmgjøringskravmulighet } from '@app/types/mulighet';
import type { HandlingEnum } from '@app/types/receiver';

export interface Mulighet {
  id: string;
}

export interface BaseRegistrering {
  id: string;
  sakenGjelderValue: string | null;
  journalpostId: string | null;
  typeId: RegistreringType | null; // Samme type-IDer som i Kodeverket.
  mulighet: Mulighet | null;
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
  klagemuligheter: IKlagemulighet[];
  ankemuligheter: IAnkemulighet[];
  omgjoeringskravmuligheter: IOmgjøringskravmulighet[];
}

export interface DraftRegistrering extends BaseRegistrering {
  finished: null;
  behandlingId: null;
}

export interface FinishedRegistrering extends BaseRegistrering {
  sakenGjelderValue: string;
  journalpostId: string;
  typeId: RegistreringType; // Samme type-IDer som i Kodeverket.
  mulighet: Mulighet;
  /** When the registration was finished.
   * @type: DateTime
   */
  finished: string;
  behandlingId: string;
}

export interface FinishedRegistreringListItem {
  id: string;
  sakenGjelderValue: string | null;
  typeId: RegistreringType | null; // Samme type-IDer som i Kodeverket.
  ytelseId: string | null;
  created: string;
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
  /** Nav ident */
  saksbehandlerIdent: string | null;
  gosysOppgaveId: number | null;
}

export interface Svarbrev {
  send: boolean | null;
  overrideBehandlingstid: boolean;
  behandlingstid: Behandlingstid | null;
  calculatedFrist: string | null;
  fullmektigFritekst: string | null;
  receivers: Receiver[];
  title: string; // default DEFAULT_SVARBREV_NAME
  overrideCustomText: boolean;
  customText: string | null;
  initialCustomText: string | null;
}

export interface Receiver {
  id: string;
  part: IPart;
  handling: HandlingEnum | null;
  overriddenAddress: IAddress | null;
}
