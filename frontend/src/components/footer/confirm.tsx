import { Cancel, SuccessStroke } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { createAnke } from '../../api/api';
import { ApiContext } from '../../pages/create/api-context';
import { useAnkemuligheter } from '../../simple-api-state/use-api';
import { skipToken } from '../../types/common';
import { CreateResponse } from '../../types/create';
import { errorToast } from '../toast/error-toast';
import { toast } from '../toast/store';
import { ToastType } from '../toast/types';
import { IApiErrorReponse, IApiValidationResponse, isApiError, isValidationResponse } from './error-type-guard';

interface Props {
  show: boolean;
  closeConfirm: () => void;
  fnr: string | typeof skipToken;
  setError: (error: IApiValidationResponse | IApiErrorReponse | Error | undefined) => void;
}

export const Confirm = ({ show, fnr, setError, closeConfirm }: Props) => {
  const [loading, setLoading] = useState(false);
  const { payload, setErrors } = useContext(ApiContext);
  const { updateData: updateAnkemuligheter } = useAnkemuligheter(fnr);
  const navigate = useNavigate();

  if (!show) {
    return null;
  }

  const onClick = async () => {
    if (payload === null) {
      return;
    }

    setLoading(true);
    setError(undefined);
    setErrors(null);

    try {
      const res = await createAnke(payload);

      if (res.ok) {
        updateAnkemuligheter((data) => data?.filter((d) => d.behandlingId !== payload.klagebehandlingId));

        setError(undefined);

        const json = (await res.json()) as CreateResponse;

        navigate(`/anker/${json.mottakId}/status`);
      } else {
        const json: unknown = await res.json();

        errorToast(json);

        if (isApiError(json)) {
          setError(json);
        } else if (isValidationResponse(json)) {
          setError(json);
          setErrors(json.sections);
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        toast({ type: ToastType.ERROR, message: `Feil ved oppretting av anke: ${e.message}` });

        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledConfirm>
      <Alert size="small" variant="info" inline>
        Du fullf??rer n?? registrering av anken. Anken blir journalf??rt og klar for saksbehandling i Kabal. Bekreft at du
        ??nsker ?? fullf??re registrering av anken.
      </Alert>
      <Buttons>
        <Button
          variant="primary"
          size="small"
          icon={<SuccessStroke aria-hidden />}
          loading={loading}
          onClick={onClick}
          disabled={payload === null}
        >
          Bekreft
        </Button>
        <Button variant="secondary" size="small" onClick={closeConfirm} icon={<Cancel aria-hidden />}>
          Avbryt
        </Button>
      </Buttons>
    </StyledConfirm>
  );
};

const StyledConfirm = styled.div`
  background: var(--a-surface-default);
  border: 1px solid var(--a-border-action);
  border-radius: 4px;
  position: absolute;
  padding: var(--a-spacing-4);
  width: 300px;
  bottom: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;
