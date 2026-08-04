import type {
  InngaaendeKanal,
  Receiver,
  RegistreringDokument,
  Source,
  UploadSource,
} from '@app/redux/api/registreringer/types';
import type { BehandlingstidUnitType } from '@app/types/calculate-frist';
import type { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import type { IArkivertDocument } from '@app/types/dokument';

interface IBaseStatusFields {
  fagsakId: string;
  fagsystemId: string;
  /** Date */
  frist: string;
  fullmektig: IPart | null;
  klager: IPart;
  /** Date */
  mottattKlageinstans: string;
  sakenGjelder: IPart;
  ytelseId: string;
  tildeltSaksbehandler: ISaksbehandler | null;
  /** Date */
  varsletFrist: string | null;
  varsletFristUnits: number | null;
  varsletFristUnitTypeId: BehandlingstidUnitType | null;
  /** When the registrering was finished.
   * @type {string} DateTime
   */
  finished: string;
  svarbrev: SvarbrevStatus | null;
}

interface IJournalpostSourceStatus {
  source: Source.JOURNALPOST;
  journalpost: IArkivertDocument;
  uploadedDocuments: null;
}

export interface UploadedDocumentsStatus {
  dokumenter: RegistreringDokument[];
  inngaaendeKanal: InngaaendeKanal;
}

interface IUploadedDocumentsSourceStatus {
  source: UploadSource;
  journalpost: null;
  uploadedDocuments: UploadedDocumentsStatus;
}

type IBaseStatus = IBaseStatusFields & (IJournalpostSourceStatus | IUploadedDocumentsSourceStatus);

export interface SvarbrevStatus {
  dokumentUnderArbeidId: string;
  title: string;
  receivers: Receiver[];
}

export type IAnkestatus = IBaseStatus & {
  typeId: SaksTypeEnum.ANKE;
  vedtakDate: string | null;
};

export type IKlagestatus = IBaseStatus & {
  typeId: SaksTypeEnum.KLAGE;
  mottattVedtaksinstans: string;
  vedtakDate: string;
};

export type IOmgjøringskravstatus = IBaseStatus & {
  typeId: SaksTypeEnum.OMGJØRINGSKRAV;
  vedtakDate: string | null;
};

export type IBegjæringOmGjenopptakStatus = IBaseStatus & {
  typeId: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK;
  vedtakDate: string | null;
};
