import { useSakstypeName } from '@app/hooks/kodeverk';
import type { SaksTypeEnum } from '@app/types/common';
import { Skeleton, Tag } from '@navikt/ds-react';

interface Props {
  typeId: SaksTypeEnum;
}

export const MulighetTypeName = ({ typeId }: Props) => {
  const [isLoading, name] = useSakstypeName(typeId);

  if (isLoading) {
    return <Skeleton height="42px" />;
  }

  return (
    <Tag data-color="info" variant="outline" size="small">
      {name}
    </Tag>
  );
};
