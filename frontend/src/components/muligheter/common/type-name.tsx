import { useSakstypeName } from '@app/hooks/kodeverk';
import type { SaksTypeEnum } from '@app/types/common';
import { Tag } from '@navikt/ds-react';

interface Props {
  typeId: SaksTypeEnum;
}

export const TypeName = ({ typeId }: Props) => {
  const [isLoading, name] = useSakstypeName(typeId);

  return (
    <Tag data-color="info" variant="outline" size="small">
      {isLoading ? 'Laster...' : name}
    </Tag>
  );
};
