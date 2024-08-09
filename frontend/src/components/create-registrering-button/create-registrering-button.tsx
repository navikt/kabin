import { PlusIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRegistreringMutation } from '@app/redux/api/registreringer/main';

interface Props {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
}

export const CreateRegistreringButton = (props: Props) => {
  const navigate = useNavigate();
  const [create, { isLoading }] = useCreateRegistreringMutation();

  const onClick = useCallback(async () => {
    const { id } = await create({ sakenGjelderValue: null }).unwrap();
    navigate(`/registrering/${id}`);
  }, [create, navigate]);

  return (
    <Button {...props} onClick={onClick} loading={isLoading} icon={<PlusIcon aria-hidden role="presentation" />}>
      Opprett ny registrering
    </Button>
  );
};
