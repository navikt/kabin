import { CustomRecipients } from '@app/components/svarbrev/custom-recipients';
import { useSuggestedBrevmottakere } from '@app/components/svarbrev/get-suggested-part-recipients';
import { ReadOnlyReceivers } from '@app/components/svarbrev/read-only-recipients';
import { SingleReceiver } from '@app/components/svarbrev/single-receiver';
import { SuggestedReceivers } from '@app/components/svarbrev/suggested-receivers';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';

export const Receivers = () => {
  const { svarbrev } = useRegistrering();
  const canEdit = useCanEdit();
  const suggestedReceivers = useSuggestedBrevmottakere();

  if (!canEdit) {
    return <ReadOnlyReceivers />;
  }

  const customRecipients = svarbrev.receivers.filter((m) => suggestedReceivers.every((s) => s.part.id !== m.part.id));
  const [recipient] = suggestedReceivers;
  const onlyOneRecipient = suggestedReceivers.length === 1 && customRecipients.length === 0 && recipient !== undefined;

  return (
    <>
      {onlyOneRecipient ? (
        <SingleReceiver receiver={recipient} />
      ) : (
        <SuggestedReceivers suggestedReceivers={suggestedReceivers} />
      )}

      <CustomRecipients mottakerList={customRecipients} />
    </>
  );
};
