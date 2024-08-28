import { parseUserInput } from '@app/components/date-picker/parse-user-input';
import { Warning } from '@app/components/date-picker/warning';
import { prettyDateToISO } from '@app/domain/date';
import { FORMAT, PRETTY_FORMAT } from '@app/domain/date-formats';
import { type DateInputProps, DatePicker } from '@navikt/ds-react';
import { format } from 'date-fns';
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
  warningThreshhold?: Date;
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
  warningThreshhold,
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
        error={error}
        label={label}
        disabled={disabled}
        value={input}
        onChange={({ target }) => setInput(target.value)}
        onBlur={onBlur}
        size={size}
      />
      <Warning date={value} threshhold={warningThreshhold} />
    </DatePicker>
  );
};
