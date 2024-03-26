import React, { useCallback } from 'react';
import { CustomRecipients } from '@app/components/svarbrev/custom-recipients';
import { SingleRecipient } from '@app/components/svarbrev/single-recipient';
import { SuggestedRecipients } from '@app/components/svarbrev/suggested-recipients';
import { PartRecipient } from '@app/components/svarbrev/types';
import { Recipient } from '@app/pages/create/app-context/types';

interface Props {
  recipients: Recipient[];
  suggestedRecipients: PartRecipient[];
  setRecipients: (recipients: Recipient[]) => void;
}

export const Receipients = ({ recipients, suggestedRecipients, setRecipients }: Props) => {
  const addRecipients = useCallback(
    (newRecipients: Recipient[]) => {
      const recipientsList =
        newRecipients.length === 0 && suggestedRecipients.length === 1
          ? [...suggestedRecipients.filter((s) => !recipients.some((m) => m.part.id === s.part.id)), ...recipients]
          : [...recipients];

      for (const newRecipient of newRecipients) {
        if (recipientsList.some((r) => r.part.id === newRecipient.part.id)) {
          continue;
        }

        recipientsList.push(newRecipient);
      }

      setRecipients(recipientsList);
    },
    [recipients, setRecipients, suggestedRecipients],
  );

  const removeMottakere = useCallback(
    (ids: string[]) => {
      const recipientsList = recipients.filter((r) => !ids.includes(r.part.id));

      if (recipientsList.length === recipients.length) {
        return;
      }

      setRecipients(recipientsList);
    },
    [recipients, setRecipients],
  );

  const changeRecipient = useCallback(
    (changedRecipient: Recipient) => {
      const recipientCount = recipients.length;
      const recipientsList = new Array<Recipient>(recipientCount);
      let found = false;

      for (let i = recipientCount; i >= 0; i--) {
        const _recipient = recipients[i];

        if (_recipient === undefined) {
          continue;
        }

        if (_recipient.part.id === changedRecipient.part.id) {
          found = true;
          recipientsList[i] = {
            part: _recipient.part,
            handling: changedRecipient.handling ?? _recipient.handling,
            overriddenAddress:
              changedRecipient.overriddenAddress === undefined
                ? _recipient.overriddenAddress
                : changedRecipient.overriddenAddress,
          };
        } else {
          recipientsList[i] = _recipient;
        }
      }

      if (!found) {
        recipientsList.push(changedRecipient);
      }

      setRecipients(recipientsList);
    },
    [recipients, setRecipients],
  );

  const customRecipients = recipients.filter((m) => suggestedRecipients.every((s) => s.part.id !== m.part.id));
  const [recipient] = suggestedRecipients;
  const onlyOneRecipient = suggestedRecipients.length === 1 && customRecipients.length === 0 && recipient !== undefined;

  return (
    <>
      {onlyOneRecipient ? (
        <SingleRecipient recipient={recipient} changeRecipient={changeRecipient} />
      ) : (
        <SuggestedRecipients
          suggestedRecipients={suggestedRecipients}
          selectedIds={recipients.map((r) => r.part.id)}
          addRecipients={addRecipients}
          removeRecipients={removeMottakere}
          changeRecipient={changeRecipient}
        />
      )}

      <CustomRecipients
        mottakerList={customRecipients}
        addRecipients={addRecipients}
        removeRecipients={removeMottakere}
        changeRecipient={changeRecipient}
      />
    </>
  );
};
