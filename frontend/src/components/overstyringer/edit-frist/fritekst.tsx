import { TextField } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';

interface Props {
  disabled: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const Fritekst = ({ disabled, value, onChange }: Props) => {
  const { updateState, type, state } = useContext(AppContext);

  useEffect(() => {
    if (type === Type.NONE || value === state?.svarbrev.customText) {
      return;
    }

    const timeout = setTimeout(() => {
      updateState({ svarbrev: { customText: value } });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state?.svarbrev.customText, type, updateState, value]);

  if (type === Type.NONE) {
    return null;
  }

  return (
    <StyledFritekst
      size="small"
      label="Fritekst"
      disabled={disabled}
      value={value ?? ''}
      onChange={({ target }) => {
        onChange(target.value.trim().length === 0 ? null : target.value);
      }}
    />
  );
};

const StyledFritekst = styled(TextField)`
  flex-grow: 1;
`;
