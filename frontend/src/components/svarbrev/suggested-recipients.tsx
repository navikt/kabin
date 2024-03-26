import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Checkbox, CheckboxGroup, Tag, Tooltip } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { StyledRecipient } from '@app/components/svarbrev/address/layout';
import { Options } from '@app/components/svarbrev/options';
import { StyledBrevmottaker, StyledRecipientContent } from '@app/components/svarbrev/styled-components';
import { getTypeNames } from '@app/components/svarbrev/type-name';
import { PartRecipient } from '@app/components/svarbrev/use-suggested-part-recipients';
import { Recipient } from '@app/pages/create/api-context/types';
import { IdType } from '@app/types/common';

interface RecipientsProps {
  suggestedRecipients: PartRecipient[];
  selectedIds: string[];
  addRecipients: (recipients: Recipient[]) => void;
  removeRecipients: (ids: string[]) => void;
  changeRecipient: (recipient: Recipient) => void;
  sendErrors: {}[];
}

export const SuggestedRecipients = ({
  suggestedRecipients,
  selectedIds,
  addRecipients,
  removeRecipients,
  changeRecipient,
  sendErrors,
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
        const { id, name, statusList } = part;
        // const error = sendErrors.find((e) => e.field === id)?.reason ?? null;
        const error = null; // TODO: Fix this
        const isPerson = part.type === IdType.FNR;
        const isChecked = selectedIds.includes(id);

        return (
          <StyledRecipient key={id}>
            <StyledBrevmottaker>
              <Checkbox size="small" value={id} data-testid="document-send-recipient" error={error !== null}>
                <StyledRecipientContent>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <span>
                    {name} ({getTypeNames(typeList)})
                  </span>
                  <PartStatusList statusList={statusList} />
                  {error === null ? null : (
                    <Tag variant="error" size="xsmall">
                      {error}
                    </Tag>
                  )}
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
