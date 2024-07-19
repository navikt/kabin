import { TrashIcon } from '@navikt/aksel-icons';
import { useContext } from 'react';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import { BaseProps } from '@app/components/overstyringer/types';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { IPart } from '@app/types/common';

interface Props {
  part: IPart | null;
  partField: BaseProps['partField'];
}

export const RemovePartButton = ({ part, partField }: Props) => {
  const { type } = useContext(AppContext);

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
