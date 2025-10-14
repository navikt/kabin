import { type RegistreringType, SaksTypeEnum } from '@app/types/common';

export const getKlagerTitle = (registreringType: RegistreringType | null): string => {
  switch (registreringType) {
    case null:
    case SaksTypeEnum.KLAGE:
      return 'Klager';
    case SaksTypeEnum.ANKE:
      return 'Ankende part';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'Den som krever omgjøring';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return 'Den som begjærer gjenopptak';
  }
};
