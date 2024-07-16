import { TextField } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import { styled } from 'styled-components';
import { useValidationError } from '@app/hooks/use-validation-error';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { ValidationFieldNames } from '@app/types/validation';

interface Props {
  disabled: boolean;
  initialValue: number;
}

export const Units = ({ disabled, initialValue }: Props) => {
  const { type, state, updateState } = useContext(AppContext);
  const error = useValidationError(ValidationFieldNames.FRIST);

  const parseAndSet = useCallback(
    (v: string): void => {
      const parsed = Number.parseInt(v, 10);

      if (!Number.isNaN(parsed) && parsed >= 0 && type !== Type.NONE) {
        updateState({ svarbrev: { varsletBehandlingstidUnits: parsed } });
      }
    },
    [type, updateState],
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => parseAndSet(target.value),
    [parseAndSet],
  );

  return (
    <StyledTextField
      type="number"
      label="Frist"
      hideLabel
      size="small"
      min={0}
      id={ValidationFieldNames.FRIST}
      value={state?.svarbrev.varsletBehandlingstidUnits ?? initialValue}
      onChange={onInputChange}
      error={error}
      disabled={disabled}
    />
  );
};

const StyledTextField = styled(TextField)`
  grid-area: frist;
  width: 60px;
`;
