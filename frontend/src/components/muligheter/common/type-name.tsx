import { type SaksTypeEnum, TYPE_NAME } from '@app/types/common';
import { Tag } from '@navikt/ds-react';

interface Props {
  typeId: SaksTypeEnum;
}

export const TypeName = ({ typeId }: Props) => {
  return (
    <Tag variant="info" size="small">
      {TYPE_NAME[typeId]}
    </Tag>
  );
};
