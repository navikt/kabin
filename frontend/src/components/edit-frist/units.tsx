import { TextField } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ValidationFieldNames } from '@app/types/validation';

interface Props {
  disabled?: boolean;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export const Units = ({ disabled, value, onChange, label }: Props) => {
  const error = useValidationError(ValidationFieldNames.FRIST);

  const parseAndSet = useCallback(
    (v: string): void => {
      const parsed = Number.parseInt(v, 10);

      if (!Number.isNaN(parsed) && parsed >= 0) {
        onChange(parsed);
      }
    },
    [onChange],
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => parseAndSet(target.value),
    [parseAndSet],
  );

  return (
    <StyledTextField
      type="number"
      label={label}
      hideLabel
      size="small"
      min={1}
      id={ValidationFieldNames.FRIST}
      value={value}
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
