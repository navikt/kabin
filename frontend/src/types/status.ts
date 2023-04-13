import { IAnkeMulighet } from './ankemulighet';
import { SaksTypeEnum } from './common';
import { IArkivertDocument } from './dokument';

export interface IStatus extends IAnkeMulighet {
  typeId: SaksTypeEnum;
  mottattNav: string; // LocalDate
  frist: string; // LocalDate
  // frist: number; // Number of weeks
  journalpost: IArkivertDocument;
}
