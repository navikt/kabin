import { Button } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { ISetPart } from '@app/components/overstyringer/part-read/types';
import { BaseProps } from '@app/components/overstyringer/types';
import { compareParts } from '@app/domain/part';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IPart } from '@app/types/common';

interface Props extends ISetPart {
  partField: BaseProps['partField'];
  part: IPart | null;
  loading?: boolean;
}

export const SetPartButton = ({ part, defaultPart, partField, label, title, icon, loading }: Props) => {
  const { type, updatePayload } = useContext(ApiContext);

  if (type === Type.NONE || compareParts(defaultPart, part)) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title={title}
      icon={icon}
      onClick={() => updatePayload({ overstyringer: { [partField]: defaultPart } })}
      loading={loading}
    >
      {label}
    </Button>
  );
};
