import { TrashIcon } from '@navikt/aksel-icons';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import { BaseProps } from '@app/components/overstyringer/types';

interface Props {
  partField: BaseProps['partField'];
}

export const RemovePartButton = ({ partField }: Props) => (
  <SetPartButton
    partField={partField}
    defaultPart={null}
    label="Fjern"
    title="Fjern"
    icon={<TrashIcon aria-hidden />}
  />
);
