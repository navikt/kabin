import { Type } from '@app/pages/create/app-context/types';
import { SvarbrevSettings } from '@app/types/svarbrev-settings';

export const getSvarbrevSettings = (settings: SvarbrevSettings | undefined, type: Type) => {
  if (settings === undefined) {
    return null;
  }

  if (type === Type.ANKE) {
    return settings[1];
  }

  if (type === Type.KLAGE) {
    return settings[0];
  }

  return null;
};
