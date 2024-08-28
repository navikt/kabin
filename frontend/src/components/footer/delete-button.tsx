import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useDeleteRegistreringMutation } from '@app/redux/api/registreringer/main';
import { Alert, Button } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';

export const DeleteButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const id = useRegistreringId();

  const [, { isLoading: isDeleting }] = useDeleteRegistreringMutation({ fixedCacheKey: `${id}delete` });
  const [, { isLoading: isFinishing }] = useDeleteRegistreringMutation({ fixedCacheKey: `${id}finish` });

  return (
    <DeleteContainer>
      <Button
        onClick={() => setShowConfirm(!showConfirm)}
        size="small"
        variant="danger"
        disabled={isDeleting || isFinishing}
        loading={isDeleting}
      >
        Slett registrering
      </Button>

      {showConfirm ? <Confirm close={() => setShowConfirm(false)} /> : null}
    </DeleteContainer>
  );
};

const Confirm = ({ close }: { close: () => void }) => {
  const id = useRegistreringId();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(close, ref);

  const [deleteRegistrering, { isLoading }] = useDeleteRegistreringMutation({ fixedCacheKey: `${id}delete` });

  return (
    <Container ref={ref}>
      <Alert size="small" inline variant="warning">
        Er du sikker på at du vil slette denne registreringen?
      </Alert>
      <Buttons>
        <Button
          onClick={async () => {
            await deleteRegistrering(id).unwrap();
            navigate('/');
          }}
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
  justify-content: space-between;
  gap: 8px;
`;

const Container = styled.section`
  position: absolute;
  bottom: 100%;
  background-color: var(--a-bg-default);
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
  border: 1px solid var(--a-border-warning);
  padding: 16px;
  width: 270px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DeleteContainer = styled.div`
  position: relative;
`;
