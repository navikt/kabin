import { Button, Tooltip } from '@navikt/ds-react';
import { ISetPart } from '@app/components/overstyringer/part-read/types';
import { BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { formatId } from '@app/functions/format-id';
import { useRegistrering } from '@app/hooks/use-registrering';
import {
  useSetAvsenderMutation,
  useSetFullmektigMutation,
  useSetKlagerMutation,
} from '@app/redux/api/overstyringer/overstyringer';
import { IPart } from '@app/types/common';

interface Props extends ISetPart<IPart | null> {
  partField: BaseProps['partField'];
  loading?: boolean;
}

interface Hooks {
  [FieldNames.KLAGER]: typeof useSetKlagerMutation;
  [FieldNames.FULLMEKTIG]: typeof useSetFullmektigMutation;
  [FieldNames.AVSENDER]: typeof useSetAvsenderMutation;
}

const SET_PART_HOOKS: Hooks = {
  [FieldNames.KLAGER]: useSetKlagerMutation,
  [FieldNames.FULLMEKTIG]: useSetFullmektigMutation,
  [FieldNames.AVSENDER]: useSetAvsenderMutation,
};

export const SetPartButton = ({ defaultPart, partField, label, title, icon, loading }: Props) => {
  const { id } = useRegistrering();

  const [setPart, { isLoading }] = SET_PART_HOOKS[partField]();

  return (
    <Tooltip
      content={
        defaultPart === null
          ? `Nullstill ${partField}`
          : `${defaultPart.name ?? 'Ukjent navn'} (${formatId(defaultPart.id)})`
      }
    >
      <Button
        size="small"
        variant="secondary"
        title={title}
        icon={icon}
        onClick={() => setPart({ id, part: defaultPart })}
        loading={isLoading || loading}
      >
        {label}
      </Button>
    </Tooltip>
  );
};
