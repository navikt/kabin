import { TrashIcon } from '@navikt/aksel-icons';
import React, { useContext } from 'react';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import { BaseProps } from '@app/components/overstyringer/types';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IPart } from '@app/types/common';

interface Props {
  part: IPart | null;
  partField: BaseProps['partField'];
}

export const RemovePartButton = ({ part, partField }: Props) => {
  const { type } = useContext(ApiContext);

  if (type === Type.NONE || part === null) {
    return null;
  }

  return (
    <SetPartButton
      part={part}
      partField={partField}
      defaultPart={null}
      label="Fjern"
      title="Fjern"
      icon={<TrashIcon aria-hidden />}
    />
  );
};
