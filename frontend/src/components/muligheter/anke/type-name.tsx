import { SaksTypeEnum } from '@app/types/common';
import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  typeId: SaksTypeEnum;
}

export const TypeName = ({ typeId }: Props) => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return (
        <NowrapTag variant="info" size="small">
          Klage
        </NowrapTag>
      );
    case SaksTypeEnum.ANKE:
      return (
        <NowrapTag variant="alt1" size="small">
          Anke
        </NowrapTag>
      );
    case SaksTypeEnum.ANKE_I_TR:
      return (
        <NowrapTag variant="warning" size="small">
          Anke i TR
        </NowrapTag>
      );
  }
};

const NowrapTag = styled(Tag)`
  white-space: nowrap;
`;
