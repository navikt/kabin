import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Label, Tooltip } from '@navikt/ds-react';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledReceiver } from '@app/components/svarbrev/address/layout';
import { Options } from '@app/components/svarbrev/options';
import { StyledBrevmottaker, StyledRecipientContent } from '@app/components/svarbrev/styled-components';
import { getTypeNames } from '@app/components/svarbrev/type-name';
import { PartSuggestedReceiver } from '@app/components/svarbrev/types';
import { useRegistrering } from '@app/hooks/use-registrering';
import { isReceiver } from '@app/pages/create/app-context/types';
import { useChangeSvarbrevReceiverMutation } from '@app/redux/api/svarbrev/svarbrev';
import { IAddress, IdType } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';

interface Props {
  receiver: PartSuggestedReceiver;
}

export const SingleReceiver = ({ receiver: singleReceiver }: Props) => {
  const { part, typeList } = singleReceiver;
  const isPerson = part.type === IdType.FNR;
  const { id, svarbrev } = useRegistrering();
  const [changeRecipient] = useChangeSvarbrevReceiverMutation();

  const isAdded = isReceiver(singleReceiver) && svarbrev.receivers.some((r) => r.id === singleReceiver.id);

  const onChange = (receiverId: string, handling: HandlingEnum, overriddenAddress: IAddress | null) =>
    changeRecipient({ receiverId, id, handling, overriddenAddress });

  return (
    <section>
      <Label size="small">Eneste mulige mottaker</Label>
      <StyledReceiver>
        <StyledBrevmottaker>
          <StyledRecipientContent>
            <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
              {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
            </Tooltip>
            <span>
              {part.name} ({getTypeNames(typeList)})
            </span>
            <PartStatusList statusList={part.statusList} />
          </StyledRecipientContent>
        </StyledBrevmottaker>
        {isAdded ? <Options {...singleReceiver} onChange={onChange} /> : null}
      </StyledReceiver>
    </section>
  );
};
