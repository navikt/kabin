import { TextField } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';

interface Props {
  disabled: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const Fritekst = ({ disabled, value, onChange }: Props) => (
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

const StyledFritekst = styled(TextField)`
  flex-grow: 1;
`;
