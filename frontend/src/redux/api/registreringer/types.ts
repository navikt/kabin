import { ENVIRONMENT } from '@app/environment';
import type { BehandlingstidUnitType } from '@app/types/calculate-frist';
import type { IAddress, IPart, RegistreringType } from '@app/types/common';
import type {
  IAdditionalKabalMulighet,
  IAnkemulighet,
  IBegjæringOmGjenopptakMulighet,
  IKlagemulighet,
  IOmgjøringskravmulighet,
} from '@app/types/mulighet';
import type { HandlingEnum } from '@app/types/receiver';

export interface Mulighet {
  id: string;
}

export enum DokumentStatus {
  UPLOADING = 'UPLOADING',
  UPLOADING_DONE = 'UPLOADING_DONE',
  VIRUS_SCANNING = 'VIRUS_SCANNING',
  VIRUS_SCANNING_DONE = 'VIRUS_SCANNING_DONE',
  CONVERTING = 'CONVERTING',
  CONVERTING_DONE = 'CONVERTING_DONE',
  DONE = 'DONE',
  VIRUS_FOUND = 'VIRUS_FOUND',
  VIRUS_SCAN_FAILED = 'VIRUS_SCAN_FAILED',
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  UNSUPPORTED_TYPE = 'UNSUPPORTED_TYPE',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

export const DOKUMENT_FAILED_STATUSES: DokumentStatus[] = [
  DokumentStatus.VIRUS_FOUND,
  DokumentStatus.VIRUS_SCAN_FAILED,
  DokumentStatus.CONVERSION_FAILED,
  DokumentStatus.UNSUPPORTED_TYPE,
  DokumentStatus.UNEXPECTED_ERROR,
];

export const DOKUMENT_TERMINAL_STATUSES: DokumentStatus[] = [DokumentStatus.DONE, ...DOKUMENT_FAILED_STATUSES];

/** Failed statuses that can be retried by re-processing the already-uploaded file server-side,
 * as opposed to `VIRUS_FOUND` and `UNSUPPORTED_TYPE`, which are permanent outcomes for the
 * uploaded file and require the user to delete it and upload a new one instead. */
export const DOKUMENT_RETRYABLE_STATUSES: DokumentStatus[] = [
  DokumentStatus.VIRUS_SCAN_FAILED,
  DokumentStatus.CONVERSION_FAILED,
  DokumentStatus.UNEXPECTED_ERROR,
];

export interface RegistreringDokument {
  id: string;
  name: string;
  size: number;
  created: string;
  status: DokumentStatus;
  contentType: string;
  /** Determines document order: ascending, lowest first. The document with the lowest
   * `sortIndex` is the hoveddokument - there is no separate field or concept for it. */
  sortIndex: number;
}

export enum Source {
  JOURNALPOST = 'JOURNALPOST',
  UPLOADED_DOCUMENTS = 'UPLOADED_DOCUMENTS',
  /** Anke received through Altinn. Behaves like `UPLOADED_DOCUMENTS`, except `inngaaendeKanal`,
   * `typeId` and `overstyringer.avsender` are set by the API when the source is selected, and
   * cannot be changed by the user. */
  ANKE = 'ANKE',
}

/** Sources whose documents are uploaded files rather than an existing journalpost. */
export type UploadSource = Source.UPLOADED_DOCUMENTS | Source.ANKE;

export const isUploadSource = (source: Source): source is UploadSource =>
  source === Source.UPLOADED_DOCUMENTS || source === Source.ANKE;

export enum InngaaendeKanal {
  ALTINN_INNBOKS = 'ALTINN_INNBOKS',
  E_POST = 'E_POST',
}

export interface UploadedDocuments {
  dokumenter: RegistreringDokument[];
  inngaaendeKanal: InngaaendeKanal | null;
}

export interface BaseRegistrering {
  id: string;
  mulighetIsBasedOnJournalpost: boolean;
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
  muligheter: {
    klagemuligheter: IKlagemulighet[];
    ankemuligheter: IAnkemulighet[];
    omgjoeringskravmuligheter: IOmgjøringskravmulighet[];
    gjenopptaksmuligheter: IBegjæringOmGjenopptakMulighet[];
    muligheterFetched: string; // DateTime
  };
  additionalKabalMuligheter: IAdditionalKabalMulighet[];
  additionalKabalMulighet: { id: string } | null;
  source: Source;
  uploadedDocuments: UploadedDocuments;
}

export interface DraftRegistrering extends BaseRegistrering {
  finished: null;
  behandlingId: null;
}

export interface FinishedRegistrering extends BaseRegistrering {
  sakenGjelderValue: string;
  /** `null` when `source` is an upload source - nothing can be derived from `journalpostId` in
   * that case, since the registrering's documents were uploaded rather than selected from an
   * existing journalpost. */
  journalpostId: string | null;
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
  forrigeBehandlendeEnhetId: string | null;
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
  reasonNoLetter: string | null;
}

export interface Receiver {
  id: string;
  part: IPart;
  handling: HandlingEnum | null;
  overriddenAddress: IAddress | null;
}

export const GET_FERDIGE_REGISTRERINGER_PARAMS = {
  sidenDager: ENVIRONMENT.isProduction ? 7 : 1_000_000,
};
