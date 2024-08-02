import { Buildings3Icon, PersonIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Label, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { receiverStyle } from '@app/components/svarbrev/address/layout';
import { Options } from '@app/components/svarbrev/options';
import { EditPart } from '@app/components/svarbrev/part/edit-part';
import { StyledBrevmottaker, StyledRecipientContent } from '@app/components/svarbrev/styled-components';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { Receiver } from '@app/redux/api/registreringer/types';
import {
  useAddSvarbrevReceiverMutation,
  useChangeSvarbrevReceiverMutation,
  useRemoveSvarbrevReceiverMutation,
} from '@app/redux/api/svarbrev/svarbrev';
import { IdType } from '@app/types/common';
import { HandlingEnum } from '@app/types/recipient';

interface Props {
  receivers: Receiver[];
  // addRecipients: (recipients: Recipient[]) => void;
  // removeRecipients: (ids: string[]) => void;
  // changeRecipient: (recipient: Recipient) => void;
}

export const CustomReceivers = ({ receivers }: Props) => {
  const id = useRegistreringId();
  const [addRecipient] = useAddSvarbrevReceiverMutation();

  return (
    <section>
      <Label size="small" htmlFor="extra-recipients">
        Ekstra mottakere
      </Label>
      <EditPart
        isLoading={false}
        id="extra-recipients"
        onChange={(part) =>
          addRecipient({ id, receiver: { part, handling: HandlingEnum.AUTO, overriddenAddress: null } })
        }
        buttonText="Legg til mottaker"
      />
      <Receivers receivers={receivers} />
    </section>
  );
};

interface ReceiversProps {
  receivers: Receiver[];
}

const Receivers = ({ receivers }: ReceiversProps) => {
  const registreringId = useRegistreringId();
  const [remove] = useRemoveSvarbrevReceiverMutation();
  const [change] = useChangeSvarbrevReceiverMutation();

  const onChange = (recipient: Receiver) => change({ id: recipient.part.id, receiver: recipient });

  if (receivers.length === 0) {
    return null;
  }

  return (
    <StyledReceiverList aria-label="Liste over ekstra mottakere">
      {receivers.map(({ part, handling, overriddenAddress, id }) => {
        const isPerson = part.type === IdType.FNR;

        return (
          <StyledReceiver key={part.id} aria-label={part.name ?? part.id}>
            <StyledRecipientContent>
              <StyledBrevmottaker>
                <StyledReceiverInnerContent>
                  <Tooltip content="Fjern mottaker">
                    <Button
                      size="xsmall"
                      variant="tertiary-neutral"
                      title="Fjern"
                      icon={<TrashIcon color="var(--a-surface-danger)" aria-hidden />}
                      onClick={() => remove({ id: registreringId, receiverId: part.id })}
                    />
                  </Tooltip>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <StyledName>
                    <span>{part.name}</span>
                    <CopyPartIdButton id={part.id} size="xsmall" />
                  </StyledName>
                  <PartStatusList statusList={part.statusList} />
                </StyledReceiverInnerContent>
              </StyledBrevmottaker>
            </StyledRecipientContent>
            <Options
              part={part}
              handling={handling}
              overriddenAddress={overriddenAddress}
              onChange={onChange}
              id={id}
            />
          </StyledReceiver>
        );
      })}
    </StyledReceiverList>
  );
};

const StyledReceiverInnerContent = styled.div`
  display: flex;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
  gap: 4px;
`;

const StyledReceiverList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 4px;
`;

const StyledReceiver = styled.li`
  ${receiverStyle}
`;

const StyledName = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
`;
