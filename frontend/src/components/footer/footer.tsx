import { DeleteButton } from '@app/components/footer/delete-button';
import { FinishButton } from '@app/components/footer/finish-button';
import { ValidationSummaryPopup } from '@app/components/footer/validation-summary-popup';
import { useIsOwner } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';
import { Button, HStack } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router-dom';

export const Footer = () => {
  const isOwner = useIsOwner();
  const { id, finished } = useRegistrering();
  const [, { isError }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}finish` });

  const isFinished = finished !== null;

  if (!isOwner) {
    return (
      <StyledFooter hasError={isError} isFinished={isFinished}>
        <HStack gap="space-8" wrap={false}>
          {isFinished ? <StatusButton /> : null}
        </HStack>
      </StyledFooter>
    );
  }

  return (
    <StyledFooter hasError={isError} isFinished={isFinished}>
      <HStack gap="space-8" wrap={false}>
        {isFinished ? <StatusButton /> : <FinishButton />}
        {isFinished ? null : <DeleteButton />}
      </HStack>
      <ValidationSummaryPopup />
    </StyledFooter>
  );
};

const StatusButton = () => {
  const { id } = useRegistrering();

  return (
    <Button as={RouterLink} size="small" variant="primary" to={`/registrering/${id}/status`}>
      Status
    </Button>
  );
};

interface StyledFooterProps {
  hasError: boolean;
  isFinished: boolean;
  children: React.ReactNode;
}

const StyledFooter = ({ hasError, isFinished, children }: StyledFooterProps) => {
  const getBorderColor = () => {
    if (hasError) {
      return 'border-ax-border-warning';
    }
    if (isFinished) {
      return 'border-ax-border-success';
    }
    return 'border-ax-border-accent';
  };

  const getBackgroundColor = () => {
    if (hasError) {
      return 'bg-ax-bg-warning-soft';
    }
    if (isFinished) {
      return 'bg-ax-bg-success-soft';
    }
    return 'bg-ax-bg-accent-soft';
  };

  return (
    <HStack
      align="center"
      justify="space-between"
      width="100%"
      paddingInline="space-16"
      paddingBlock="space-8"
      className={`relative bottom-0 left-0 z-1 border-t ${getBorderColor()} ${getBackgroundColor()}`}
    >
      {children}
    </HStack>
  );
};
