import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { receiverStyle } from '@app/components/svarbrev/address/layout';
import { EditPart } from '@app/components/svarbrev/part/edit-part';
import { ShowOptionsOrWarning } from '@app/components/svarbrev/receiver-options-warning';
import { StyledBrevmottaker, StyledReceiverContent } from '@app/components/svarbrev/styled-components';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import type { Receiver } from '@app/redux/api/registreringer/types';
import { useAddSvarbrevReceiverMutation, useRemoveSvarbrevReceiverMutation } from '@app/redux/api/svarbrev/svarbrev';
import { IdType } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';
import { Buildings3Icon, PersonIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Label, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  receivers: Receiver[];
}

export const CustomReceivers = ({ receivers }: Props) => {
  const id = useRegistreringId();
  const [add, { isLoading }] = useAddSvarbrevReceiverMutation();

  return (
    <section>
      <Label size="small" htmlFor="extra-receivers">
        Ekstra mottakere
      </Label>
      <EditPart
        isAdding={isLoading}
        id="extra-receivers"
        onChange={(part) => add({ id, receiver: { part, handling: HandlingEnum.AUTO, overriddenAddress: null } })}
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
  const [remove, { isLoading: isRemoving }] = useRemoveSvarbrevReceiverMutation();

  if (receivers.length === 0) {
    return null;
  }

  return (
    <StyledReceiverList aria-label="Liste over ekstra mottakere">
      {receivers.map(({ part, id, ...props }) => {
        const isPerson = part.type === IdType.FNR;

        return (
          <StyledReceiver key={id} aria-label={part.name ?? part.identifikator}>
            <StyledReceiverContent>
              <StyledBrevmottaker>
                <StyledReceiverInnerContent>
                  <Tooltip content="Fjern mottaker">
                    <Button
                      size="xsmall"
                      variant="tertiary-neutral"
                      title="Fjern"
                      icon={<TrashIcon color="var(--ax-bg-danger-strong)" aria-hidden />}
                      onClick={() => remove({ id: registreringId, receiverId: id })}
                      loading={isRemoving}
                    />
                  </Tooltip>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <StyledName>
                    <span>{part.name}</span>
                    <CopyPartIdButton id={part.identifikator} size="xsmall" />
                  </StyledName>
                  <PartStatusList statusList={part.statusList} />
                </StyledReceiverInnerContent>
              </StyledBrevmottaker>
            </StyledReceiverContent>

            <ShowOptionsOrWarning receiver={{ ...props, part, id }} isLoading={isRemoving} />
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
