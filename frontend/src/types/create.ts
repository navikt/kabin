import type { BehandlingstidUnitType } from '@app/types/calculate-frist';
import type { SaksTypeEnum } from '@app/types/common';

interface SvarbrevBase {
  title: string;
  fullmektigFritekst: string | null;
  varsletBehandlingstidUnits: number;
  varsletBehandlingstidUnitTypeId: BehandlingstidUnitType;
  customText: string | null;
  initialCustomText: string | null;
}

export interface SvarbrevPreviewInput extends SvarbrevBase {
  mottattKlageinstans: string;
  sakenGjelder: string;
  ytelseId: string;
  klager: string | null;
  typeId: SaksTypeEnum;
}
