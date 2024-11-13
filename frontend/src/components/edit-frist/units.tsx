import { useValidationError } from '@app/hooks/use-validation-error';
import { ValidationFieldNames } from '@app/types/validation';
import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button, HStack, TextField } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  readOnly?: boolean;
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
}

export const Units = ({ readOnly, value, onChange, label, min = 1 }: Props) => {
  const error = useValidationError(ValidationFieldNames.FRIST);
  const [internalValue, setInternalValue] = useState<string>(value.toString(10));
  const minValue = min.toString(10);

  useEffect(() => {
    if (readOnly) {
      return;
    }

    const parsed = parse(internalValue);

    if (parsed === null || parsed === value) {
      return;
    }

    const timeout = setTimeout(() => onChange(parsed), 500);

    return () => clearTimeout(timeout);
  }, [internalValue, onChange, value, readOnly]);

  const increment = useCallback(() => setInternalValue(incrementValue), []);
  const decrement = useCallback(() => setInternalValue((prev) => decrementValue(prev, min)), [min]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        increment();
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        decrement();
      }
    },
    [increment, decrement],
  );

  const onBlur = useCallback(
    ({ target }: React.FocusEvent<HTMLInputElement>) => {
      const parsed = parse(target.value);

      if (parsed === null) {
        setInternalValue(value.toString(10));
      } else if (parsed < min) {
        setInternalValue(minValue);
        onChange(min);
      } else if (parsed !== value) {
        onChange(parsed);
      }
    },
    [value, min, minValue, onChange],
  );

  return (
    <HStack gridColumn="frist" wrap={false} flexShrink="0">
      <TextField
        type="text"
        label={label}
        hideLabel
        size="small"
        htmlSize={2}
        min={min}
        pattern="\d*" // Only allow digits
        id={ValidationFieldNames.FRIST}
        value={readOnly ? value : internalValue}
        onChange={({ target }) => setInternalValue(target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        error={error}
        readOnly={readOnly}
      />
      <Button
        size="xsmall"
        variant="tertiary-neutral"
        icon={<PlusIcon aria-hidden />}
        onClick={increment}
        disabled={readOnly}
        aria-label="Øk med 1"
        title="Øk med 1"
      />
      <Button
        size="xsmall"
        variant="tertiary-neutral"
        icon={<MinusIcon aria-hidden />}
        onClick={decrement}
        disabled={readOnly || internalValue === minValue}
        aria-label="Mink med 1"
        title="Mink med 1"
      />
    </HStack>
  );
};

const parse = (v: string): number | null => {
  const parsed = Number.parseInt(v, 10);

  if (!Number.isNaN(parsed) && parsed >= 0) {
    return parsed;
  }

  return null;
};

const incrementValue = (v: string): string => ((parse(v) ?? 0) + 1).toString(10);

const decrementValue = (v: string, min: number): string => {
  const decremented = (parse(v) ?? 0) - 1;

  return decremented < min ? v : decremented.toString(10);
};
