import { type SaksTypeEnum, TYPE_NAME } from '@app/types/common';
import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  typeId: SaksTypeEnum;
}

export const TypeName = ({ typeId }: Props) => {
  return (
    <NowrapTag variant="info" size="small">
      {TYPE_NAME[typeId]}
    </NowrapTag>
  );
};

const NowrapTag = styled(Tag)`
  white-space: nowrap;
`;
