import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import type { BaseProps } from '@app/components/overstyringer/types';
import { TrashIcon } from '@navikt/aksel-icons';

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
