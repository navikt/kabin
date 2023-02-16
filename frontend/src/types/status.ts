import { IBehandling } from './behandling';
import { SaksTypeEnum } from './common';
import { IArkivertDocument } from './dokument';

export interface IStatus extends IBehandling {
  typeId: SaksTypeEnum;
  mottattNav: string; // LocalDate
  frist: string; // LocalDate
  // frist: number; // Number of weeks
  journalpost: IArkivertDocument;
}
