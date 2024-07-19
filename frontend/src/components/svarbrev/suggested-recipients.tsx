import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Checkbox, CheckboxGroup, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledRecipient } from '@app/components/svarbrev/address/layout';
import { Options } from '@app/components/svarbrev/options';
import { StyledBrevmottaker, StyledRecipientContent } from '@app/components/svarbrev/styled-components';
import { getTypeNames } from '@app/components/svarbrev/type-name';
import { PartRecipient } from '@app/components/svarbrev/types';
import { Recipient } from '@app/pages/create/app-context/types';
import { IdType } from '@app/types/common';

interface RecipientsProps {
  suggestedRecipients: PartRecipient[];
  selectedIds: string[];
  addRecipients: (recipients: Recipient[]) => void;
  removeRecipients: (ids: string[]) => void;
  changeRecipient: (recipient: Recipient) => void;
}

export const SuggestedRecipients = ({
  suggestedRecipients,
  selectedIds,
  addRecipients,
  removeRecipients,
  changeRecipient,
}: RecipientsProps) => {
  const onSelectedChange = useCallback(
    (idList: string[]) => {
      const addList: Recipient[] = [];
      const removeList: string[] = [];

      for (const sm of suggestedRecipients) {
        if (idList.includes(sm.part.id)) {
          if (!selectedIds.includes(sm.part.id)) {
            addList.push(sm);
          }
        } else if (selectedIds.includes(sm.part.id)) {
          removeList.push(sm.part.id);
        }
      }

      if (addList.length !== 0) {
        addRecipients(addList);
      }

      if (removeList.length !== 0) {
        removeRecipients(removeList);
      }
    },
    [suggestedRecipients, selectedIds, addRecipients, removeRecipients],
  );

  if (suggestedRecipients.length === 0) {
    return null;
  }

  return (
    <CheckboxGroup
      legend="Foreslåtte mottakere fra saken"
      value={selectedIds}
      onChange={onSelectedChange}
      data-testid="document-send-recipient-list"
      size="small"
    >
      {suggestedRecipients.map(({ part, typeList, handling, overriddenAddress }) => {
        const isPerson = part.type === IdType.FNR;
        const isChecked = selectedIds.includes(part.id);

        return (
          <StyledRecipient key={part.id}>
            <StyledBrevmottaker>
              <Checkbox size="small" value={part.id} data-testid="document-send-recipient">
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
            {isChecked ? (
              <Options
                part={part}
                handling={handling}
                overriddenAddress={overriddenAddress}
                onChange={changeRecipient}
              />
            ) : null}
          </StyledRecipient>
        );
      })}
    </CheckboxGroup>
  );
};
