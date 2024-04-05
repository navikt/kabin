import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { IApiErrorReponse, isApiError, isValidationSection } from '@app/components/footer/error-type-guard';
import { IApiValidationResponse, IValidationSection } from '@app/types/validation';
import { StyledHeader, ValidationSummary } from './validation-summary';

interface Props {
  error: IApiValidationResponse | IValidationSection | IApiErrorReponse | Error | undefined;
}

export const ValidationSummaryPopup = ({ error }: Props) => {
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

const RenderError = ({ error }: { error: IApiValidationResponse | IValidationSection | IApiErrorReponse | Error }) => {
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

  return <ValidationSummary sections={error.sections} />;
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
