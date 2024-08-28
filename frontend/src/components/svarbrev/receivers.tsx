import { CustomReceivers } from '@app/components/svarbrev/custom-receivers';
import { ReadOnlyReceivers } from '@app/components/svarbrev/read-only-receivers';
import { SingleReceiver } from '@app/components/svarbrev/single-receiver';
import { SuggestedReceivers } from '@app/components/svarbrev/suggested-receivers';
import { useSuggestedBrevmottakere } from '@app/components/svarbrev/use-suggested-brevmottakere';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { styled } from 'styled-components';

export const Receivers = () => {
  const { svarbrev } = useRegistrering();
  const canEdit = useCanEdit();
  const suggestedReceivers = useSuggestedBrevmottakere();

  if (!canEdit) {
    return <ReadOnlyReceivers />;
  }

  const customReceivers = svarbrev.receivers.filter((m) => suggestedReceivers.every((s) => s.part.id !== m.part.id));
  const [receiver] = suggestedReceivers;
  const onlyOneReceiver = suggestedReceivers.length === 1 && customReceivers.length === 0 && receiver !== undefined;

  return (
    <Content>
      {onlyOneReceiver ? (
        <SingleReceiver receiver={receiver} />
      ) : (
        <SuggestedReceivers suggestedReceivers={suggestedReceivers} />
      )}

      <CustomReceivers receivers={customReceivers} />
    </Content>
  );
};

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;
