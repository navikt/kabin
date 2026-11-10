import { useSakstypeName } from '@app/hooks/kodeverk';
import { SaksTypeEnum } from '@app/types/common';
import { Skeleton, Tag, type TagProps } from '@navikt/ds-react';

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

const SAKSTYPE_TO_TAG_COLOR: Record<SaksTypeEnum, TagProps['data-color']> = {
  [SaksTypeEnum.KLAGE]: 'meta-purple',
  [SaksTypeEnum.ANKE]: 'success',
  [SaksTypeEnum.ANKE_AFTER_2027]: 'brand-magenta',
  [SaksTypeEnum.ANKE_I_TR]: 'danger',
  [SaksTypeEnum.ANKE_I_TR_AFTER_2027]: 'brand-beige',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'info',
  [SaksTypeEnum.TR_OPPHEVET]: 'meta-lime',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'success',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'neutral',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027]: 'brand-magenta',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR_AFTER_2027]: 'warning',
};

const NonNullableTypeTag = ({ typeId }: { typeId: SaksTypeEnum }) => {
  const [isLoading, name] = useSakstypeName(typeId);

  if (isLoading) {
    return <Skeleton height="42px" />;
  }

  return (
    <Tag size="small" variant="strong" data-color={SAKSTYPE_TO_TAG_COLOR[typeId]}>
      {name}
    </Tag>
  );
};
