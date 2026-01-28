import { type SaksTypeEnum, TYPE_NAME } from '@app/types/common';
import { Tag } from '@navikt/ds-react';

interface Props {
  typeId: SaksTypeEnum;
}

export const TypeName = ({ typeId }: Props) => {
  return (
    <Tag data-color="info" variant="outline" size="small">
      {TYPE_NAME[typeId]}
    </Tag>
  );
};
