import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useDeleteRegistreringMutation, useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';
import { Box, Button, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export const DeleteButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const id = useRegistreringId();

  const [, { isLoading: isDeleting }] = useDeleteRegistreringMutation({ fixedCacheKey: `${id}:delete` });
  const [, { isLoading: isFinishing }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}:finish` });

  return (
    <Box position="relative">
      <Button
        data-color="danger"
        onClick={() => setShowConfirm(!showConfirm)}
        size="small"
        variant="primary"
        disabled={isDeleting || isFinishing}
        loading={isDeleting}
      >
        Slett registrering
      </Button>
      {showConfirm ? <Confirm close={() => setShowConfirm(false)} /> : null}
    </Box>
  );
};

const Confirm = ({ close }: { close: () => void }) => {
  const id = useRegistreringId();
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);

  useOnClickOutside(close, ref);

  const [deleteRegistrering, { isLoading }] = useDeleteRegistreringMutation({ fixedCacheKey: `${id}:delete` });

  return (
    <Box
      asChild
      position="absolute"
      bottom="space-0"
      width="270px"
      background="default"
      padding="space-16"
      borderRadius="4"
      borderColor="warning"
      borderWidth="1"
      shadow="dialog"
    >
      <VStack as="section" ref={ref} gap="space-8">
        <InlineMessage size="small" status="warning">
          Er du sikker på at du vil slette denne registreringen?
        </InlineMessage>
        <HStack justify="space-between" gap="space-8" wrap={false}>
          <Button
            data-color="danger"
            onClick={async () => {
              await deleteRegistrering(id).unwrap();
              navigate('/');
            }}
            size="small"
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
          >
            Bekreft
          </Button>

          <Button
            data-color="neutral"
            size="small"
            variant="secondary"
            disabled={isLoading}
            loading={isLoading}
            onClick={close}
          >
            Avbryt
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
