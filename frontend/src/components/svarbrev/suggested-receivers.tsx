import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledReceiver } from '@app/components/svarbrev/address/layout';
import { ShowOptionsOrWarning } from '@app/components/svarbrev/receiver-optons-warning';
import { StyledBrevmottaker, StyledReceiverContent } from '@app/components/svarbrev/styled-components';
import { getTypeNames } from '@app/components/svarbrev/type-name';
import type { PartSuggestedReceiver } from '@app/components/svarbrev/types';
import { useRegistrering } from '@app/hooks/use-registrering';
import { isReceiver } from '@app/pages/registrering/app-context/types';
import { useAddSvarbrevReceiverMutation, useRemoveSvarbrevReceiverMutation } from '@app/redux/api/svarbrev/svarbrev';
import { IdType } from '@app/types/common';
import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Checkbox, CheckboxGroup, Tooltip } from '@navikt/ds-react';

interface Props {
  suggestedReceivers: PartSuggestedReceiver[];
}

export const SuggestedReceivers = ({ suggestedReceivers }: Props) => {
  const { id, svarbrev } = useRegistrering();
  const [addReceiver, { isLoading }] = useAddSvarbrevReceiverMutation();
  const [remove] = useRemoveSvarbrevReceiverMutation();

  if (suggestedReceivers.length === 0) {
    return null;
  }

  return (
    <CheckboxGroup
      legend="Foreslåtte mottakere fra saken"
      value={svarbrev.receivers.map((r) => r.part.identifikator)}
      data-testid="document-send-receiver-list"
      size="small"
    >
      {suggestedReceivers.map((suggestedReceiver) => {
        const { typeList, ...receiver } = suggestedReceiver;
        const { part } = receiver;
        const isPerson = part.type === IdType.FNR;
        const isAdded = isReceiver(receiver) && svarbrev.receivers.some((r) => r.id === receiver.id);

        return (
          <StyledReceiver key={part.identifikator} aria-label={part.name ?? part.identifikator}>
            <StyledBrevmottaker>
              <Checkbox
                size="small"
                value={part.identifikator}
                data-testid="document-send-receiver"
                onChange={() => (isAdded ? remove({ id, receiverId: receiver.id }) : addReceiver({ id, receiver }))}
              >
                <StyledReceiverContent>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <span>
                    {part.name} ({getTypeNames(typeList)})
                  </span>
                  <PartStatusList statusList={part.statusList} />
                </StyledReceiverContent>
              </Checkbox>
            </StyledBrevmottaker>

            <ShowOptionsOrWarning receiver={suggestedReceiver} isLoading={isLoading} />
          </StyledReceiver>
        );
      })}
    </CheckboxGroup>
  );
};
