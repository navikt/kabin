import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Label, Tooltip } from '@navikt/ds-react';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledRecipient } from '@app/components/svarbrev/address/layout';
import { Options } from '@app/components/svarbrev/options';
import { StyledBrevmottaker, StyledRecipientContent } from '@app/components/svarbrev/styled-components';
import { getTypeNames } from '@app/components/svarbrev/type-name';
import { PartSuggestedReceiver } from '@app/components/svarbrev/types';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { isReceiver } from '@app/pages/create/app-context/types';
import { useChangeSvarbrevReceiverMutation } from '@app/redux/api/svarbrev/svarbrev';
import { IdType } from '@app/types/common';
import { useRegistrering } from '@app/hooks/use-registrering';
import { Receiver } from '@app/redux/api/registreringer/types';

interface Props {
  receiver: PartSuggestedReceiver;
}

export const SingleReceiver = ({ receiver }: Props) => {
  const { part, handling, overriddenAddress, typeList } = receiver;
  const isPerson = part.type === IdType.FNR;
  const {id,svarbrev} = useRegistrering();
  const [changeRecipient] = useChangeSvarbrevReceiverMutation();

  const isAdded = isReceiver(receiver) && svarbrev.receivers.some((r) => r.id === receiver.id);

  const onChange = (receiver: Receiver) => changeRecipient({ id, receiver });

  return (
    <section>
      <Label size="small">Eneste mulige mottaker</Label>
      <StyledRecipient>
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
        {isAdded ? <Options {...receiver} onChange={onChange} /> : null}
      </StyledRecipient>
    </section>
  );
};
