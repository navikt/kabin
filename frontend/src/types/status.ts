import { Receiver } from '@app/redux/api/registreringer/types';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import { IArkivertDocument } from './dokument';

interface IBaseStatus {
  fagsakId: string;
  originalFagsystemId: string;
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
}

export interface SvarbrevStatus {
  dokumentUnderArbeidId: string;
  title: string;
  receivers: Receiver[];
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
  svarbrev: SvarbrevStatus | null;
}
