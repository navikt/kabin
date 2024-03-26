import { Recipient } from '@app/pages/create/app-context/types';
import { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import { IArkivertDocument } from './dokument';

interface IBaseStatus {
  fagsakId: string;
  fagsystemId: string;
  frist: string; // LocalDate
  fullmektig: IPart | null;
  journalpost: IArkivertDocument;
  klager: IPart;
  mottattKlageinstans: string; // LocalDate
  sakenGjelder: IPart;
  ytelseId: string;
  tildeltSaksbehandler: ISaksbehandler | null;
}

export interface SvarbrevStatus {
  dokumentUnderArbeidId: string;
  title: string;
  receivers: Recipient[];
}

export interface IAnkestatus extends IBaseStatus {
  typeId: SaksTypeEnum.ANKE;
  vedtakDate: string | null;
  svarbrev: SvarbrevStatus | null;
}

export interface IKlagestatus extends IBaseStatus {
  typeId: SaksTypeEnum.KLAGE;
  mottattVedtaksinstans: string;
  vedtakDate: string;
}
