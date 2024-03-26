import { Buildings3Icon, PersonIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Label, Tag, Tooltip } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { recipientStyle } from '@app/components/svarbrev/address/layout';
import { Options } from '@app/components/svarbrev/options';
import { EditPart } from '@app/components/svarbrev/part/edit-part';
import { StyledBrevmottaker, StyledRecipientContent } from '@app/components/svarbrev/styled-components';
import { Recipient } from '@app/pages/create/api-context/types';
import { IdType } from '@app/types/common';
import { HandlingEnum } from '@app/types/create';
// import { IErrorProperty } from './is-send-error';

interface Props {
  mottakerList: Recipient[];
  addRecipients: (recipients: Recipient[]) => void;
  removeRecipients: (ids: string[]) => void;
  changeRecipient: (recipient: Recipient) => void;
  sendErrors: {}[];
}

export const CustomRecipients = ({
  mottakerList,
  addRecipients,
  removeRecipients,
  changeRecipient,
  sendErrors,
}: Props) => (
  <section>
    <Label size="small" htmlFor="extra-recipients">
      Ekstra mottakere
    </Label>
    <EditPart
      isLoading={false}
      id="extra-recipients"
      onChange={(part) => addRecipients([{ part, handling: HandlingEnum.AUTO, overriddenAddress: null }])}
      buttonText="Legg til mottaker"
    />
    <Recipients
      recipientList={mottakerList}
      removeRecipients={removeRecipients}
      changeRecipient={changeRecipient}
      sendErrors={sendErrors}
    />
  </section>
);

interface RecipientsProps {
  recipientList: Recipient[];
  removeRecipients: (ids: string[]) => void;
  changeRecipient: (recipient: Recipient) => void;
  sendErrors: {}[];
}

const Recipients = ({ recipientList, removeRecipients, changeRecipient, sendErrors }: RecipientsProps) => {
  if (recipientList.length === 0) {
    return null;
  }

  return (
    <StyledRecipientList>
      {recipientList.map(({ part, handling, overriddenAddress }) => {
        // const error = sendErrors.find((e) => e.field === part.id)?.reason ?? null;
        const error = null; // TODO: Fix this
        const isPerson = part.type === IdType.FNR;

        return (
          <StyledRecipient key={part.id}>
            <StyledRecipientContent>
              <StyledBrevmottaker>
                <StyledRecipientInnerContent>
                  <Tooltip content="Fjern mottaker">
                    <Button
                      size="xsmall"
                      variant="tertiary-neutral"
                      title="Fjern"
                      icon={<TrashIcon color="var(--a-surface-danger)" aria-hidden />}
                      onClick={() => removeRecipients([part.id])}
                    />
                  </Tooltip>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <StyledName>
                    <span>{part.name}</span>
                    <CopyPartIdButton id={part.id} />
                  </StyledName>
                  <PartStatusList statusList={part.statusList} />
                  {error === null ? null : (
                    <Tag variant="error" size="xsmall">
                      {error}
                    </Tag>
                  )}
                </StyledRecipientInnerContent>
              </StyledBrevmottaker>
            </StyledRecipientContent>
            <Options part={part} handling={handling} overriddenAddress={overriddenAddress} onChange={changeRecipient} />
          </StyledRecipient>
        );
      })}
    </StyledRecipientList>
  );
};

const StyledRecipientInnerContent = styled.div`
  display: flex;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
  gap: 4px;
`;

const StyledRecipientList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 4px;
`;

const StyledRecipient = styled.li`
  ${recipientStyle}
`;

const StyledName = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
`;
