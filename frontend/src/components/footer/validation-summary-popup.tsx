import { Collapse, Expand } from '@navikt/ds-icons';
import { Alert } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IApiErrorReponse, IApiValidationResponse, isValidationResponse } from './error-type-guard';
import { ValidationSummary } from './validation-summary';

interface Props {
  error: IApiValidationResponse | IApiErrorReponse | Error | undefined;
}

export const ValidationSummaryPopup = ({ error }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isValidationResponse(error)) {
      return;
    }

    if (error.sections.length !== 0) {
      setIsOpen(true);
    }
  }, [error]);

  if (!isValidationResponse(error) || error.sections.length === 0) {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  const Icon = isOpen ? Expand : Collapse;

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
          <ValidationSummary sections={error.sections} />
        </StyledPopup>
      )}
    </>
  );
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
