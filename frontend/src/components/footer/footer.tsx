import { useState } from 'react';
import { styled } from 'styled-components';
import { DeleteButton } from '@app/components/footer/delete-button';
import { IApiErrorReponse } from '@app/components/footer/error-type-guard';
import { FinishButton } from '@app/components/footer/finish-button';
import { IApiValidationResponse, IValidationSection } from '@app/types/validation';
import { ValidationSummaryPopup } from './validation-summary-popup';

type FooterErrors = IApiValidationResponse | IValidationSection | IApiErrorReponse | Error;

export const Footer = () => {
  const [error, setError] = useState<FooterErrors>();

  return (
    <StyledFooter $hasError={error !== undefined}>
      <Buttons>
        <FinishButton setError={setError} />
        <DeleteButton />
      </Buttons>
      <ValidationSummaryPopup error={error} />
    </StyledFooter>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

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
