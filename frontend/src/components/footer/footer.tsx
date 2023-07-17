import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { IApiErrorReponse } from '@app/components/footer/error-type-guard';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { IApiValidationResponse } from '@app/types/validation';
import { Confirm } from './confirm';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const Footer = () => {
  const [error, setError] = useState<IApiValidationResponse | IApiErrorReponse | Error | undefined>();
  const { payload } = useContext(ApiContext);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleConfirm = () => setShowConfirm(!showConfirm);
  const closeConfirm = () => setShowConfirm(false);

  return (
    <StyledFooter $hasError={typeof error !== 'undefined'}>
      <Button
        onClick={toggleConfirm}
        size="small"
        icon={<CheckmarkIcon aria-hidden />}
        variant="primary"
        disabled={payload === null}
      >
        Fullfør
      </Button>

      <Confirm show={showConfirm} setError={setError} closeConfirm={closeConfirm} />

      <ValidationSummaryPopup error={error} />
    </StyledFooter>
  );
};

interface IStyleProps {
  $hasError: boolean;
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
  border-top: 1px solid ${({ $hasError }) => ($hasError ? '#d47b00' : '#368da8')};
  background-color: ${({ $hasError }) => ($hasError ? '#ffe9cc' : '#e0f5fb')};
`;
