import { SaksTypeEnum } from '@app/types/common';
import { Tag } from '@navikt/ds-react';

export const Type = ({ typeId }: { typeId: string | null }) => {
  switch (typeId) {
    case null:
      return (
        <Tag data-color="neutral" variant="outline" size="small">
          Ikke satt
        </Tag>
      );
    case SaksTypeEnum.KLAGE:
      return (
        <Tag data-color="info" variant="outline" size="small">
          Klage
        </Tag>
      );
    case SaksTypeEnum.ANKE:
      return (
        <Tag data-color="meta-purple" variant="outline" size="small">
          Anke
        </Tag>
      );
  }
};
