import { IPart, ITilknyttetDokument, SaksTypeEnum } from '@app/types/common';
import { IArkivertDocument } from './dokument';
import { UtfallEnum } from './kodeverk';

interface IBaseStatus {
  behandlingId: string;
  fagsakId: string;
  fagsystemId: string;
  frist: string; // LocalDate
  fullmektig: IPart | null;
  journalpost: IArkivertDocument;
  klager: IPart;
  mottattKlageinstans: string; // LocalDate
  sakenGjelder: IPart;
  vedtakDate: string;
  ytelseId: string;
}

export interface IAnkestatus extends IBaseStatus {
  typeId: SaksTypeEnum.ANKE;
  tilknyttedeDokumenter: ITilknyttetDokument[];
  utfallId: UtfallEnum;
}

export interface IKlagestatus extends IBaseStatus {
  typeId: SaksTypeEnum.KLAGE;
  mottattVedtaksinstans: string;
  utfall: string;
}
