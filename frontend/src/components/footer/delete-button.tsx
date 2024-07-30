import { BodyShort, Button } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useDeleteRegistreringMutation } from '@app/redux/api/registrering';

export const DeleteButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const id = useRegistreringId();

  const [, { isLoading }] = useDeleteRegistreringMutation({ fixedCacheKey: id });

  return (
    <DeleteContainer>
      <Button
        onClick={() => setShowConfirm(!showConfirm)}
        size="small"
        variant="danger"
        disabled={isLoading}
        loading={isLoading}
      >
        Slett registrering
      </Button>

      {showConfirm ? <Confirm close={() => setShowConfirm(false)} /> : null}
    </DeleteContainer>
  );
};

const Confirm = ({ close }: { close: () => void }) => {
  const id = useRegistreringId();

  const [deleteRegistrering, { isLoading }] = useDeleteRegistreringMutation({ fixedCacheKey: id });

  return (
    <Container>
      <BodyShort>Er du sikker på at du vil slette denne registreringen?</BodyShort>
      <Buttons>
        <Button
          onClick={() => deleteRegistrering(id)}
          size="small"
          variant="danger"
          disabled={isLoading}
          loading={isLoading}
        >
          Bekreft
        </Button>

        <Button size="small" variant="secondary" disabled={isLoading} loading={isLoading} onClick={close}>
          Avbryt
        </Button>
      </Buttons>
    </Container>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const Container = styled.section`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DeleteContainer = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
`;
