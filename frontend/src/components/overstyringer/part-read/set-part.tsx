import { Button } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { ISetPart } from '@app/components/overstyringer/part-read/types';
import { BaseProps } from '@app/components/overstyringer/types';
import { compareParts } from '@app/domain/part';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { IPart } from '@app/types/common';

interface Props extends ISetPart {
  partField: BaseProps['partField'];
  part: IPart | null;
  loading?: boolean;
}

export const SetPartButton = ({ part, defaultPart, partField, label, title, icon, loading }: Props) => {
  const { type, updateState } = useContext(AppContext);

  if (type === Type.NONE || compareParts(defaultPart, part)) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title={title}
      icon={icon}
      onClick={() => updateState({ overstyringer: { [partField]: defaultPart } })}
      loading={loading}
    >
      {label}
    </Button>
  );
};
