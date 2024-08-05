import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRegistreringMutation } from '@app/redux/api/registreringer/main';

export const CreateButton = () => {
  const navigate = useNavigate();
  const [create, { isLoading }] = useCreateRegistreringMutation();

  const onClick = useCallback(async () => {
    const { id } = await create().unwrap();
    navigate(`/registrering/${id}`);
  }, [create, navigate]);

  return (
    <Button onClick={onClick} loading={isLoading} icon={<PlusIcon aria-hidden role="presentation" />}>
      Opprett ny registrering
    </Button>
  );
};
