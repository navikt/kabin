import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Checkbox, CheckboxGroup, Tooltip } from '@navikt/ds-react';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledReceiver } from '@app/components/svarbrev/address/layout';
import { Options } from '@app/components/svarbrev/options';
import { StyledBrevmottaker, StyledRecipientContent } from '@app/components/svarbrev/styled-components';
import { getTypeNames } from '@app/components/svarbrev/type-name';
import { PartSuggestedReceiver } from '@app/components/svarbrev/types';
import { useRegistrering } from '@app/hooks/use-registrering';
import { isReceiver } from '@app/pages/registrering/app-context/types';
import {
  useAddSvarbrevReceiverMutation,
  useChangeSvarbrevReceiverMutation,
  useRemoveSvarbrevReceiverMutation,
} from '@app/redux/api/svarbrev/svarbrev';
import { IAddress, IdType } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';

interface RecipientsProps {
  suggestedReceivers: PartSuggestedReceiver[];
}

export const SuggestedReceivers = ({ suggestedReceivers }: RecipientsProps) => {
  const { id, svarbrev } = useRegistrering();
  const [change] = useChangeSvarbrevReceiverMutation();
  const [addReceiver] = useAddSvarbrevReceiverMutation();
  const [remove] = useRemoveSvarbrevReceiverMutation();

  const onChange = (receiverId: string, handling: HandlingEnum, overriddenAddress: IAddress | null) =>
    change({ receiverId, id, handling, overriddenAddress });

  if (suggestedReceivers.length === 0) {
    return null;
  }

  return (
    <CheckboxGroup
      legend="Foreslåtte mottakere fra saken"
      value={svarbrev.receivers.map((r) => r.part.id)}
      data-testid="document-send-receiver-list"
      size="small"
    >
      {suggestedReceivers.map(({ typeList, ...receiver }) => {
        const { part } = receiver;
        const isPerson = part.type === IdType.FNR;
        const isAdded = isReceiver(receiver) && svarbrev.receivers.some((r) => r.id === receiver.id);

        return (
          <StyledReceiver key={part.id} aria-label={part.name ?? part.id}>
            <StyledBrevmottaker>
              <Checkbox
                size="small"
                value={part.id}
                data-testid="document-send-receiver"
                onChange={() => (isAdded ? remove({ id, receiverId: receiver.id }) : addReceiver({ id, receiver }))}
              >
                <StyledRecipientContent>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <span>
                    {part.name} ({getTypeNames(typeList)})
                  </span>
                  <PartStatusList statusList={part.statusList} />
                </StyledRecipientContent>
              </Checkbox>
            </StyledBrevmottaker>
            {isAdded ? <Options {...receiver} onChange={onChange} /> : null}
          </StyledReceiver>
        );
      })}
    </CheckboxGroup>
  );
};
