import { Type } from '@app/pages/create/app-context/types';
import { SvarbrevPreviewInput } from '@app/types/create';

export interface PreviewPdfPayload {
  mottattKlageinstans: string;
  sakenGjelder: string | null;
  ytelseId: string;
  svarbrev: SvarbrevPreviewInput;
  klager: string | null;
  typeId: Type.KLAGE | Type.ANKE;
}
