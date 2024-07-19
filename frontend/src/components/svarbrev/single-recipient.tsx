import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Label, Tooltip } from '@navikt/ds-react';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledRecipient } from '@app/components/svarbrev/address/layout';
import { Options } from '@app/components/svarbrev/options';
import { StyledBrevmottaker, StyledRecipientContent } from '@app/components/svarbrev/styled-components';
import { getTypeNames } from '@app/components/svarbrev/type-name';
import { PartRecipient } from '@app/components/svarbrev/types';
import { Recipient } from '@app/pages/create/app-context/types';
import { IdType } from '@app/types/common';

interface Props {
  recipient: PartRecipient;
  changeRecipient: (recipient: Recipient) => void;
}

export const SingleRecipient = ({ recipient, changeRecipient }: Props) => {
  const { part, handling, overriddenAddress, typeList } = recipient;
  const isPerson = part.type === IdType.FNR;

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
        <Options part={part} handling={handling} overriddenAddress={overriddenAddress} onChange={changeRecipient} />
      </StyledRecipient>
    </section>
  );
};
