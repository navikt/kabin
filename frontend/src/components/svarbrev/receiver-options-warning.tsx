import { Options } from '@app/components/svarbrev/options';
import type { PartSuggestedReceiver } from '@app/components/svarbrev/types';
import { useRegistrering } from '@app/hooks/use-registrering';
import { isReceiver } from '@app/pages/registrering/app-context/types';
import { useChangeSvarbrevReceiverMutation } from '@app/redux/api/svarbrev/svarbrev';
import type { IAddress } from '@app/types/common';
import type { HandlingEnum } from '@app/types/receiver';
import { BodyShort } from '@navikt/ds-react';

interface Props {
  receiver: Omit<PartSuggestedReceiver, 'typeList'>;
  isLoading: boolean;
}

export const ShowOptionsOrWarning = ({ receiver, isLoading }: Props) => {
  const { id, svarbrev } = useRegistrering();
  const [change] = useChangeSvarbrevReceiverMutation();
  const { handling } = receiver;

  const isAdded = isReceiver(receiver) && svarbrev.receivers.some((r) => r.id === receiver.id);

  if (!isAdded) {
    return null;
  }

  if (handling === null) {
    return <BodyShort size="small">Velg ytelse.</BodyShort>;
  }

  const onChange = (receiverId: string, h: HandlingEnum, overriddenAddress: IAddress | null) =>
    change({ receiverId, id, handling: h, overriddenAddress });

  return <Options {...receiver} handling={handling} onChange={onChange} isLoading={isLoading} />;
};
