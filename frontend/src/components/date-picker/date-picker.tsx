import { DateInputProps, UNSAFE_DatePicker } from '@navikt/ds-react';
import { addDays, format, isAfter, isBefore, isValid, parse, subDays } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { FORMAT, PRETTY_FORMAT } from './formats';
import { parseUserInput } from './parse-user-input';
import { Warning } from './warning';

interface Props {
  centuryThreshold?: number;
  disabled?: boolean;
  error?: string;
  fromDate?: Date;
  id?: string;
  label: React.ReactNode;
  onChange: (date: string | null) => void;
  size?: DateInputProps['size'];
  toDate?: Date;
  value?: Date;
  warningThreshhold?: Date;
  className?: string;
}

export const Datepicker = ({
  disabled,
  error,
  fromDate = new Date(1970),
  id,
  label,
  onChange,
  toDate = new Date(),
  value = undefined,
  size,
  centuryThreshold = 50,
  warningThreshhold,
  className,
}: Props) => {
  const [inputError, setInputError] = useState<string>();
  const [input, setInput] = useState<string>(value === undefined ? '' : format(value, PRETTY_FORMAT));

  useEffect(() => {
    setInput(value === undefined ? '' : format(value, PRETTY_FORMAT));
    setInputError(undefined);
  }, [value]);

  const onDateChange = (dateObject?: Date) => {
    setInputError(undefined);

    if (dateObject === undefined) {
      onChange(null);
    } else {
      onChange(format(dateObject, FORMAT));
    }
  };

  const [month, setMonth] = useState(value);

  const validateDate = useCallback(
    (dateObject: Date | undefined): boolean => {
      const isValidDate = dateObject !== undefined && isValid(dateObject);

      if (!isValidDate) {
        setInputError('Ugyldig dato');

        return false;
      }

      onChange(format(dateObject, FORMAT));

      const isValidRange = validateRange(dateObject, fromDate, toDate);

      if (!isValidRange) {
        setInputError(`Dato må være mellom ${format(fromDate, PRETTY_FORMAT)} og ${format(toDate, PRETTY_FORMAT)}`);

        return false;
      }

      setInputError(undefined);

      return true;
    },
    [fromDate, onChange, toDate]
  );

  const validateInput = useCallback(
    (fullInput: string): boolean => {
      const dateObject = parse(fullInput, PRETTY_FORMAT, new Date());

      return validateDate(dateObject);
    },
    [validateDate]
  );

  useEffect(() => {
    validateDate(value);
  }, [value, validateDate]);

  const onBlur = useCallback(() => {
    if (input === '') {
      setInputError(undefined);
      onChange(null);

      return;
    }
    requestAnimationFrame(() => {
      const dateString = parseUserInput(input, fromDate, toDate, centuryThreshold);

      if (validateInput(dateString)) {
        setInput(dateString);
      }
    });
  }, [centuryThreshold, fromDate, input, onChange, toDate, validateInput]);

  return (
    <UNSAFE_DatePicker
      mode="single"
      data-testid={id}
      fromDate={fromDate}
      toDate={toDate}
      defaultSelected={value}
      selected={value}
      onSelect={onDateChange}
      locale="nb"
      dropdownCaption
      month={month}
      onMonthChange={setMonth}
      onOpenToggle={() => setMonth(value)}
      className={className}
    >
      <UNSAFE_DatePicker.Input
        id={id}
        error={error ?? inputError}
        label={label}
        disabled={disabled}
        value={input}
        onChange={({ target }) => setInput(target.value)}
        onBlur={onBlur}
        size={size}
      />
      <Warning date={value} threshhold={warningThreshhold} />
    </UNSAFE_DatePicker>
  );
};

const validateRange = (dateObject: Date, fromDate: Date, toDate: Date) =>
  isAfter(dateObject, subDays(fromDate, 1)) && isBefore(dateObject, addDays(toDate, 1));
