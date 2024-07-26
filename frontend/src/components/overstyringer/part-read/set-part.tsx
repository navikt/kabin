import { Button } from '@navikt/ds-react';
import { ISetPart } from '@app/components/overstyringer/part-read/types';
import { BaseProps } from '@app/components/overstyringer/types';
import { compareParts } from '@app/domain/part';
import { useAppStateStore, useOverstyringerStore } from '@app/pages/create/app-context/state';
import { Type } from '@app/pages/create/app-context/types';
import { IPart } from '@app/types/common';

interface Props extends ISetPart {
  partField: BaseProps['partField'];
  part: IPart | null;
  loading?: boolean;
}

export const SetPartButton = ({ part, defaultPart, partField, label, title, icon, loading }: Props) => {
  const type = useAppStateStore((state) => state.type);
  const setOverstyringer = useOverstyringerStore((state) => state.setOverstyringer);

  if (type === Type.NONE || compareParts(defaultPart, part)) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title={title}
      icon={icon}
      onClick={() => setOverstyringer({ [partField]: defaultPart })}
      loading={loading}
    >
      {label}
    </Button>
  );
};
