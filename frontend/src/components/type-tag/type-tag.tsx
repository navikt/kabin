import { SaksTypeEnum } from '@app/types/common';
import { Tag, type TagProps } from '@navikt/ds-react';

interface Props {
  typeId: SaksTypeEnum | null;
}

export const TypeTag = ({ typeId }: Props) => {
  if (typeId === null) {
    return (
      <Tag data-color="neutral" variant="outline" size="small">
        Ikke satt
      </Tag>
    );
  }

  return (
    <Tag
      size="small"
      variant={typeId === SaksTypeEnum.KLAGE ? 'outline' : 'strong'}
      data-color={SAKSTYPE_TO_TAG_COLOR[typeId]}
    >
      {SAKSTYPE_TO_NAME[typeId]}
    </Tag>
  );
};

const SAKSTYPE_TO_TAG_COLOR: Record<SaksTypeEnum, TagProps['data-color']> = {
  [SaksTypeEnum.KLAGE]: 'meta-purple',
  [SaksTypeEnum.ANKE]: 'success',
  [SaksTypeEnum.ANKE_AFTER_2027]: 'info',
  [SaksTypeEnum.ANKE_I_TR]: 'danger',
  [SaksTypeEnum.TR_OPPHEVET]: 'meta-lime',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'info',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'warning',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'neutral',
};

const SAKSTYPE_TO_NAME: Record<SaksTypeEnum, string> = {
  [SaksTypeEnum.KLAGE]: 'Klage',
  [SaksTypeEnum.ANKE]: 'Anke før 1.1.27',
  [SaksTypeEnum.ANKE_AFTER_2027]: 'Anke',
  [SaksTypeEnum.ANKE_I_TR]: 'Anke i trygderetten',
  [SaksTypeEnum.TR_OPPHEVET]: 'Behandling etter TR opphevet',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'Omgjøringskrav',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'Begjæring om gjenopptak',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'Begjæring om gjenopptak i trygderetten',
};
