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

interface KlageSvarbrevSetting extends BaseSvarbrevSetting {
  typeId: SaksTypeEnum.KLAGE;
}

interface AnkeSvarbrevSetting extends BaseSvarbrevSetting {
  typeId: SaksTypeEnum.ANKE;
}

export type SvarbrevSetting = KlageSvarbrevSetting | AnkeSvarbrevSetting;

export type SvarbrevSettings = [KlageSvarbrevSetting, AnkeSvarbrevSetting];
