import { SuccessStroke } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ApiContext } from '../../pages/create/api-context';
import { skipToken } from '../../types/common';
import { Confirm } from './confirm';
import { IApiErrorReponse, IApiValidationResponse } from './error-type-guard';
import { ValidationSummaryPopup } from './validation-summary-popup';

interface Props {
  fnr: string | typeof skipToken;
}

export const Footer = ({ fnr }: Props) => {
  const [error, setError] = useState<IApiValidationResponse | IApiErrorReponse | Error | undefined>();
  const { payload } = useContext(ApiContext);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleConfirm = () => setShowConfirm(!showConfirm);
  const closeConfirm = () => setShowConfirm(false);

  const FooterStyle = typeof error === 'undefined' ? NormalFooter : ErrorFooter;

  return (
    <FooterStyle>
      <Button
        onClick={toggleConfirm}
        size="small"
        icon={<SuccessStroke aria-hidden />}
        variant="primary"
        disabled={payload === null}
      >
        Fullfør
      </Button>

      <Confirm show={showConfirm} fnr={fnr} setError={setError} closeConfirm={closeConfirm} />

      <ValidationSummaryPopup error={error} />
    </FooterStyle>
  );
};

const StyledFooter = styled.div`
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
`;

const NormalFooter = styled(StyledFooter)`
  border-top: 1px solid #368da8;
  background-color: #e0f5fb;
`;

const ErrorFooter = styled(StyledFooter)`
  border-top: 1px solid #d47b00;
  background-color: #ffe9cc;
`;
