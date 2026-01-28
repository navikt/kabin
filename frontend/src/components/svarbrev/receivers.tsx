import { CustomReceivers } from '@app/components/svarbrev/custom-receivers';
import { ReadOnlyReceivers } from '@app/components/svarbrev/read-only-receivers';
import { SingleReceiver } from '@app/components/svarbrev/single-receiver';
import { SuggestedReceivers } from '@app/components/svarbrev/suggested-receivers';
import { useSuggestedBrevmottakere } from '@app/components/svarbrev/use-suggested-brevmottakere';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ValidationFieldNames } from '@app/types/validation';
import { ErrorMessage, HGrid } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const Receivers = () => {
  const { svarbrev } = useRegistrering();
  const canEdit = useCanEdit();
  const suggestedReceivers = useSuggestedBrevmottakere();
  const error = useValidationError(ValidationFieldNames.SVARBREV_RECEIVERS);

  if (!canEdit) {
    return <ReadOnlyReceivers />;
  }

  const customReceivers = svarbrev.receivers.filter((m) =>
    suggestedReceivers.every((s) => s.part.identifikator !== m.part.identifikator),
  );
  const [receiver] = suggestedReceivers;
  const onlyOneReceiver = suggestedReceivers.length === 1 && customReceivers.length === 0 && receiver !== undefined;

  return (
    <Container>
      <HGrid columns={2} gap="space-8">
        {onlyOneReceiver ? (
          <SingleReceiver receiver={receiver} />
        ) : (
          <SuggestedReceivers suggestedReceivers={suggestedReceivers} />
        )}

        <CustomReceivers receivers={customReceivers} />
      </HGrid>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
