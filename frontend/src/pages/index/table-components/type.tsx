import { SaksTypeEnum } from '@app/types/common';
import { Tag } from '@navikt/ds-react';

export const Type = ({ typeId }: { typeId: string | null }) => {
  switch (typeId) {
    case null:
      return (
        <Tag variant="neutral" size="small">
          Ikke satt
        </Tag>
      );
    case SaksTypeEnum.KLAGE:
      return (
        <Tag variant="info" size="small">
          Klage
        </Tag>
      );
    case SaksTypeEnum.ANKE:
      return (
        <Tag variant="alt1" size="small">
          Anke
        </Tag>
      );
  }
};
