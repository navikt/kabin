import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { ISaksbehandler, SaksTypeEnum } from '@app/types/common';

interface BaseSvarbrevSetting {
  id: string;
  ytelseId: string;
  behandlingstidUnitType: BehandlingstidUnitType;
  behandlingstidUnits: number;
  customText: string | null;
  shouldSend: boolean;
  created: string;
  modifiedBy: ISaksbehandler;
  modified: string;
}

export interface KlageSvarbrevSetting extends BaseSvarbrevSetting {
  typeId: SaksTypeEnum.KLAGE;
}

export interface AnkeSvarbrevSetting extends BaseSvarbrevSetting {
  typeId: SaksTypeEnum.ANKE;
}

export type SvarbrevSettings = [KlageSvarbrevSetting, AnkeSvarbrevSetting];
