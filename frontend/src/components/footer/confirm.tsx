import { ArrowUndoIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { IApiErrorReponse } from '@app/components/footer/error-type-guard';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IApiValidationResponse } from '@app/types/validation';
import { useCreateAnke } from './anke-hooks';
import { useCreateKlage } from './klage-hooks';

interface Props {
  show: boolean;
  closeConfirm: () => void;
  setError: (error: IApiValidationResponse | IApiErrorReponse | Error | undefined) => void;
}

export const Confirm = ({ show, setError, closeConfirm }: Props) => {
  const [loading, setLoading] = useState(false);
  const { type, payload, setErrors } = useContext(ApiContext);
  const createAnkeCallback = useCreateAnke(setError);
  const createKlageCallback = useCreateKlage(setError);

  if (!show || type === Type.NONE) {
    return null;
  }

  const text = getText(type);

  const onClick = async () => {
    setLoading(true);
    setError(undefined);
    setErrors(null);

    if (type === Type.ANKE) {
      await createAnkeCallback();
    }

    if (type === Type.KLAGE) {
      await createKlageCallback();
    }

    setLoading(false);
  };

  return (
    <StyledConfirm>
      <Alert size="small" variant="info" inline>
        {text}
      </Alert>
      <Buttons>
        <Button
          variant="primary"
          size="small"
          icon={<CheckmarkIcon aria-hidden />}
          loading={loading}
          onClick={onClick}
          disabled={payload === null}
        >
          Bekreft
        </Button>
        <Button variant="secondary" size="small" onClick={closeConfirm} icon={<ArrowUndoIcon aria-hidden />}>
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

const getText = (type: Type.KLAGE | Type.ANKE) => {
  switch (type) {
    case Type.ANKE:
      return 'Du fullfører nå registrering av anken. Anken blir journalført og klar for saksbehandling i Kabal. Bekreft at du ønsker å fullføre registrering av anken.';
    case Type.KLAGE:
      return 'Du fullfører nå registrering av klagen. Klagen blir journalført og klar for saksbehandling i Kabal. Bekreft at du ønsker å fullføre registrering av klagen.';
  }
};
