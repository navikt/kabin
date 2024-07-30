import { Button } from '@navikt/ds-react';
import { ISetPart } from '@app/components/overstyringer/part-read/types';
import { BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { compareParts } from '@app/domain/part';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetAvsenderMutation, useSetFullmektigMutation, useSetKlagerMutation } from '@app/redux/api/overstyringer';
import { IPart } from '@app/types/common';

interface Props extends ISetPart {
  partField: BaseProps['partField'];
  part: IPart | null;
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

export const SetPartButton = ({ part, defaultPart, partField, label, title, icon, loading }: Props) => {
  const { id, typeId } = useRegistrering();
  const [setPart, { isLoading }] = SET_PART_HOOKS[partField]();

  if (typeId === null || compareParts(defaultPart, part)) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title={title}
      icon={icon}
      onClick={() =>
        setPart({ id, part: defaultPart === null ? null : { id: defaultPart.id, type: defaultPart.type } })
      }
      loading={isLoading || loading}
    >
      {label}
    </Button>
  );
};
