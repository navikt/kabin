import { DeleteButton } from '@app/components/footer/delete-button';
import { FinishButton } from '@app/components/footer/finish-button';
import { ValidationSummaryPopup } from '@app/components/footer/validation-summary-popup';
import { useIsOwner } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';
import { Button } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from 'styled-components';

export const Footer = () => {
  const isOwner = useIsOwner();
  const { id, finished } = useRegistrering();
  const [, { isError }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}finish` });

  const isFinished = finished !== null;

  if (!isOwner) {
    return (
      <StyledFooter $isFinished={isFinished}>
        <Buttons>{isFinished ? <StatusButton /> : null}</Buttons>
      </StyledFooter>
    );
  }

  return (
    <StyledFooter $hasError={isError} $isFinished={isFinished}>
      <Buttons>
        {isFinished ? <StatusButton /> : <FinishButton />}
        {isFinished ? null : <DeleteButton />}
      </Buttons>
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

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

interface IStyleProps {
  $hasError?: boolean;
  $isFinished: boolean;
}

const StyledFooter = styled.div<IStyleProps>`
  position: relative;
  display: flex;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-top: 8px;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  z-index: 1;

  border-top: 1px solid ${({ $hasError, $isFinished }) => getBorderColor($hasError, $isFinished)};
  background-color: ${({ $hasError, $isFinished }) => getBackgroundColor($hasError, $isFinished)};
`;

const getBackgroundColor = (hasError: boolean, isFinished: boolean) => {
  if (hasError) {
    return 'var(--a-surface-warning-subtle)';
  }

  if (isFinished) {
    return 'var(--a-surface-success-subtle)';
  }

  return 'var(--a-surface-action-subtle)';
};

const getBorderColor = (hasError: boolean, isFinished: boolean) => {
  if (hasError) {
    return 'var(--a-border-warning)';
  }

  if (isFinished) {
    return 'var(--a-border-success)';
  }

  return 'var(--a-border-action)';
};
