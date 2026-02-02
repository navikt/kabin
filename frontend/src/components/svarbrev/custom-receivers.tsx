import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledReceiverLi } from '@app/components/svarbrev/address/layout';
import { StyledBrevmottaker, StyledReceiverContent } from '@app/components/svarbrev/layout';
import { EditPart } from '@app/components/svarbrev/part/edit-part';
import { ShowOptionsOrWarning } from '@app/components/svarbrev/receiver-options-warning';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import type { Receiver } from '@app/redux/api/registreringer/types';
import { useAddSvarbrevReceiverMutation, useRemoveSvarbrevReceiverMutation } from '@app/redux/api/svarbrev/svarbrev';
import { IdType } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';
import { Buildings3Icon, PersonIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Label, Tooltip } from '@navikt/ds-react';

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
    <ul className="mt-1 list-none" aria-label="Liste over ekstra mottakere">
      {receivers.map(({ part, id, ...props }) => {
        const isPerson = part.type === IdType.FNR;

        return (
          <StyledReceiverLi key={id} aria-label={part.name ?? part.identifikator}>
            <StyledReceiverContent>
              <StyledBrevmottaker>
                <HStack align="center" gap="space-4" paddingBlock="space-4" wrap={false}>
                  <Tooltip content="Fjern mottaker">
                    <Button
                      data-color="neutral"
                      size="xsmall"
                      variant="tertiary"
                      title="Fjern"
                      icon={<TrashIcon color="var(--ax-bg-danger-strong)" aria-hidden />}
                      onClick={() => remove({ id: registreringId, receiverId: id })}
                      loading={isRemoving}
                    />
                  </Tooltip>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <HStack align="center" gap="space-4" asChild wrap={false}>
                    <span>
                      <span>{part.name}</span>
                      <CopyPartIdButton id={part.identifikator} size="xsmall" />
                    </span>
                  </HStack>
                  <PartStatusList statusList={part.statusList} />
                </HStack>
              </StyledBrevmottaker>
            </StyledReceiverContent>
            <ShowOptionsOrWarning receiver={{ ...props, part, id }} isLoading={isRemoving} />
          </StyledReceiverLi>
        );
      })}
    </ul>
  );
};
