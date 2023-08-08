import { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import { IArkivertDocument } from './dokument';
import { UtfallEnum } from './kodeverk';

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
  utfallId: UtfallEnum;
  tildeltSaksbehandler: ISaksbehandler | null;
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
