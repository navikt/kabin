import { IPartId } from '@app/types/common';
import { SvarbrevPreviewInput } from '@app/types/create';

export interface PreviewPdfPayload {
  mottattKlageinstans: string;
  fristInWeeks: number;
  sakenGjelder: IPartId;
  klager: IPartId | null;
  ytelseId: string;
  svarbrevInput: SvarbrevPreviewInput;
}
