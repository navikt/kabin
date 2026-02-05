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
    <Tag size="small" variant={SAKSTYPE_TO_TAG_VARIANT[typeId]}>
      {SAKSTYPE_TO_NAME[typeId]}
    </Tag>
  );
};

const SAKSTYPE_TO_TAG_VARIANT: Record<SaksTypeEnum, TagProps['variant']> = {
  [SaksTypeEnum.KLAGE]: 'alt1',
  [SaksTypeEnum.ANKE]: 'success-filled',
  [SaksTypeEnum.ANKE_I_TR]: 'error-filled',
  [SaksTypeEnum.TR_OPPHEVET]: 'alt2-filled',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'info-filled',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'warning-filled',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'neutral-filled',
};

const SAKSTYPE_TO_NAME: Record<SaksTypeEnum, string> = {
  [SaksTypeEnum.KLAGE]: 'Klage',
  [SaksTypeEnum.ANKE]: 'Anke',
  [SaksTypeEnum.ANKE_I_TR]: 'Anke i trygderetten',
  [SaksTypeEnum.TR_OPPHEVET]: 'Behandling etter TR opphevet',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'Omgjøringskrav',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'Begjæring om gjenopptak',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'Begjæring om gjenopptak i trygderetten',
};
