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
  [SaksTypeEnum.ANKE_AFTER_2027]: 'info',
  [SaksTypeEnum.ANKE_I_TR]: 'danger',
  [SaksTypeEnum.TR_OPPHEVET]: 'meta-lime',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'info',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'warning',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'neutral',
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
