import { SaksTypeEnum } from '@app/types/common';
import { SvarbrevSettings } from '@app/types/svarbrev-settings';

export const getSvarbrevSettings = (settings: SvarbrevSettings | undefined, type: SaksTypeEnum | null) => {
  if (settings === undefined) {
    return null;
  }

  if (type === SaksTypeEnum.ANKE) {
    return settings[1];
  }

  if (type === SaksTypeEnum.KLAGE) {
    return settings[0];
  }

  return null;
};
