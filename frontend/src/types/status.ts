import type { Receiver } from '@app/redux/api/registreringer/types';
import type { BehandlingstidUnitType } from '@app/types/calculate-frist';
import type { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import type { IArkivertDocument } from '@app/types/dokument';

interface IBaseStatus {
  fagsakId: string;
  fagsystemId: string;
  /** Date */
  frist: string;
  fullmektig: IPart | null;
  journalpost: IArkivertDocument;
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

export interface SvarbrevStatus {
  dokumentUnderArbeidId: string;
  title: string;
  receivers: Receiver[];
}

export interface IAnkestatus extends IBaseStatus {
  typeId: SaksTypeEnum.ANKE;
  vedtakDate: string | null;
}

export interface IKlagestatus extends IBaseStatus {
  typeId: SaksTypeEnum.KLAGE;
  mottattVedtaksinstans: string;
  vedtakDate: string;
}

export interface IOmgjøringskravstatus extends IBaseStatus {
  typeId: SaksTypeEnum.OMGJØRINGSKRAV;
  vedtakDate: string | null;
}
