import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort } from '@navikt/ds-react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { isApiError, isValidationResponse, isValidationSection } from '@app/components/footer/error-type-guard';
import { StyledHeader, ValidationSummary } from '@app/components/footer/validation-summary';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';

export const ValidationSummaryPopup = () => {
  const id = useRegistreringId();
  const [, { error }] = useFinishRegistreringMutation({ fixedCacheKey: id + 'finish' });

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
      {isOpen ? (
        <StyledPopup>
          <StyledIconButton onClick={toggleOpen}>
            <Icon />
          </StyledIconButton>
          <RenderError error={error} />
        </StyledPopup>
      ) : null}
    </>
  );
};

const isSerializedError = (error: FetchBaseQueryError | SerializedError): error is SerializedError => 'name' in error;

const RenderError = ({ error }: { error: FetchBaseQueryError | SerializedError }) => {
  if (isSerializedError(error)) {
    return (
      <Alert variant="error">
        <StyledHeader>Ukjent feil: {error.name}</StyledHeader>
        <BodyShort style={{ wordBreak: 'break-word' }}>{error.message}</BodyShort>
      </Alert>
    );
  }

  const { data } = error;

  if (isValidationResponse(data)) {
    return <ValidationSummary sections={data.sections} />;
  }

  if (isApiError(data)) {
    return (
      <Alert variant="warning">
        <StyledHeader>Kan ikke fullføre registrering.</StyledHeader>
        <BodyShort style={{ wordBreak: 'break-word' }}>
          {data.status} - {data.detail}
        </BodyShort>
      </Alert>
    );
  }

  if (isValidationSection(data)) {
    return <ValidationSummary sections={[data]} />;
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
