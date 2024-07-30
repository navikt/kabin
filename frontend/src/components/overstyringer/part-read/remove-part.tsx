import { TrashIcon } from '@navikt/aksel-icons';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import { BaseProps } from '@app/components/overstyringer/types';
import { useRegistrering } from '@app/hooks/use-registrering';
import { IPart } from '@app/types/common';

interface Props {
  part: IPart | null;
  partField: BaseProps['partField'];
}

export const RemovePartButton = ({ part, partField }: Props) => {
  const { typeId } = useRegistrering();

  if (typeId === null || part === null) {
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
