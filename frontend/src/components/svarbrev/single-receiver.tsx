import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Label, Tooltip } from '@navikt/ds-react';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledReceiver } from '@app/components/svarbrev/address/layout';
import { ShowOptionsOrWarning } from '@app/components/svarbrev/receiver-optons-warning';
import { StyledBrevmottaker, StyledReceiverContent } from '@app/components/svarbrev/styled-components';
import { getTypeNames } from '@app/components/svarbrev/type-name';
import { PartSuggestedReceiver } from '@app/components/svarbrev/types';
import { IdType } from '@app/types/common';

interface Props {
  receiver: PartSuggestedReceiver;
}

export const SingleReceiver = ({ receiver: singleReceiver }: Props) => {
  const { part, typeList } = singleReceiver;
  const isPerson = part.type === IdType.FNR;

  return (
    <section>
      <Label size="small">Eneste mulige mottaker</Label>
      <StyledReceiver>
        <StyledBrevmottaker>
          <StyledReceiverContent>
            <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
              {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
            </Tooltip>
            <span>
              {part.name} ({getTypeNames(typeList)})
            </span>
            <PartStatusList statusList={part.statusList} />
          </StyledReceiverContent>
        </StyledBrevmottaker>
        <ShowOptionsOrWarning {...singleReceiver} />
      </StyledReceiver>
    </section>
  );
};
