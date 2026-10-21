import { useSakstypeName } from '@app/hooks/kodeverk';
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

  return <NonNullableTypeTag typeId={typeId} />;
};

const SAKSTYPE_TO_TAG_VARIANT: Record<SaksTypeEnum, TagProps['variant']> = {
  [SaksTypeEnum.KLAGE]: 'alt1',
  [SaksTypeEnum.ANKE]: 'success-filled',
  [SaksTypeEnum.ANKE_AFTER_2027]: 'alt3-filled',
  [SaksTypeEnum.ANKE_I_TR]: 'error-filled',
  [SaksTypeEnum.TR_OPPHEVET]: 'alt2-filled',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'info-filled',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'warning-filled',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'neutral-filled',
};

const NonNullableTypeTag = ({ typeId }: { typeId: SaksTypeEnum }) => {
  const [isLoading, name] = useSakstypeName(typeId);

  return (
    <Tag size="small" variant={SAKSTYPE_TO_TAG_VARIANT[typeId]}>
      {isLoading ? 'Laster...' : name}
    </Tag>
  );
};
