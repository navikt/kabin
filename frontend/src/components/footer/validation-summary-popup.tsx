import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { isApiError, isValidationResponse, isValidationSection } from '@app/components/footer/error-type-guard';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useFinishRegistreringMutation } from '@app/redux/api/registrering';
import { StyledHeader, ValidationSummary } from './validation-summary';

export const ValidationSummaryPopup = () => {
  const id = useRegistreringId();
  const [, { error }] = useFinishRegistreringMutation({ fixedCacheKey: id });

  const hasError = error !== undefined;
  const [isOpen, setIsOpen] = useState(hasError);

  useEffect(() => {
    if (hasError) {
      setIsOpen(true);
    }
  }, [hasError]);

  if (!hasError) {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  const Icon = isOpen ? ChevronDownIcon : ChevronUpIcon;

  return (
    <>
      <StyledButton onClick={toggleOpen}>
        <Alert variant="warning" inline>
          <StyledAlertStripeText>
            <StyledStatusText>Feil i utfyllingen</StyledStatusText>
            <Icon />
          </StyledAlertStripeText>
        </Alert>
      </StyledButton>
      {isOpen && (
        <StyledPopup>
          <StyledIconButton onClick={toggleOpen}>
            <Icon />
          </StyledIconButton>
          <RenderError error={error} />
        </StyledPopup>
      )}
    </>
  );
};

const RenderError = ({ error }: { error: unknown }) => {
  if (error instanceof Error) {
    return (
      <Alert variant="warning">
        <StyledHeader>Kan ikke fullføre registrering.</StyledHeader>
        <BodyShort style={{ wordBreak: 'break-word' }}>{error.message}</BodyShort>
      </Alert>
    );
  }

  if (isApiError(error)) {
    return (
      <Alert variant="warning">
        <StyledHeader>Kan ikke fullføre registrering.</StyledHeader>
        <BodyShort style={{ wordBreak: 'break-word' }}>
          {error.status} - {error.detail}
        </BodyShort>
      </Alert>
    );
  }

  if (isValidationSection(error)) {
    return <ValidationSummary sections={[error]} />;
  }

  if (isValidationResponse(error)) {
    return <ValidationSummary sections={error.sections} />;
  }

  return <Alert variant="error">Ukjent feil</Alert>;
};

const StyledAlertStripeText = styled.div`
  display: flex;
  align-items: center;
`;

const StyledPopup = styled.div`
  position: absolute;
  bottom: 4em;
  right: 1em;
  width: 400px;
`;

const StyledButton = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
`;

const StyledStatusText = styled.span`
  margin-right: 1em;
`;

const StyledIconButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  padding: 1em;
`;
