import { parseUserInput } from '@app/components/date-picker/parse-user-input';
import { Warning } from '@app/components/date-picker/warning';
import { prettyDateToISO } from '@app/domain/date';
import { FORMAT, PRETTY_FORMAT } from '@app/domain/date-formats';
import { type DateInputProps, DatePicker } from '@navikt/ds-react';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

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
  warningThreshold?: Date;
  className?: string;
}

const DEFAULT_FROM_DATE = new Date(1970);

export const Datepicker = ({
  disabled,
  error,
  fromDate = DEFAULT_FROM_DATE,
  id,
  label,
  onChange,
  toDate = new Date(),
  value = undefined,
  size,
  centuryThreshold = 50,
  warningThreshold,
  className,
}: Props) => {
  const [input, setInput] = useState<string>(value === undefined ? '' : format(value, PRETTY_FORMAT));

  useEffect(() => {
    setInput(value === undefined ? '' : format(value, PRETTY_FORMAT));
  }, [value]);

  const onDateChange = useCallback(
    (dateObject?: Date) => {
      if (dateObject === undefined) {
        return onChange(null);
      }

      const prettyFormatted = format(dateObject, PRETTY_FORMAT);

      if (prettyFormatted !== input) {
        const isoFormatted = format(dateObject, FORMAT);
        onChange(isoFormatted);
      }
    },
    [input, onChange],
  );

  const [month, setMonth] = useState(value);

  const onBlur = useCallback(() => {
    if (input === '') {
      onChange(null);

      return;
    }

    requestAnimationFrame(() => {
      const dateString = parseUserInput(input, fromDate, toDate, centuryThreshold);

      onChange(dateString === null ? null : prettyDateToISO(dateString));
      setInput(dateString);
    });
  }, [centuryThreshold, fromDate, input, onChange, toDate]);

  return (
    <DatePicker
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
      <DatePicker.Input
        id={id}
        error={error ?? getBoundsError(fromDate, toDate, value)}
        label={label}
        disabled={disabled}
        value={input}
        onChange={({ target }) => setInput(target.value)}
        onBlur={onBlur}
        size={size}
      />
      <Warning date={value} threshold={warningThreshold} />
    </DatePicker>
  );
};

const getBoundsError = (fromDate: Date, toDate: Date, value?: Date): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (isBefore(value, fromDate) && !isSameDay(value, fromDate)) {
    return `Datoen kan ikke være før ${format(fromDate, PRETTY_FORMAT)}`;
  }

  if (isAfter(value, toDate) && !isSameDay(value, toDate)) {
    return `Datoen kan ikke være etter ${format(toDate, PRETTY_FORMAT)}`;
  }

  return undefined;
};
