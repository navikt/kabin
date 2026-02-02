import { GridArea } from '@app/components/documents/styled-grid-components';
import { PRETTY_FORMAT } from '@app/domain/date-formats';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import type { DateRange } from '@app/types/common';
import { ArrowCirclepathIcon, FunnelFillIcon, FunnelIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, DatePicker, type DatePickerProps, HStack } from '@navikt/ds-react';
import { format, formatISO } from 'date-fns';
import { useRef, useState } from 'react';

interface Props extends Pick<DatePickerProps, 'fromDate' | 'toDate'> {
  children: React.ReactNode;
  onChange: (value?: DateRange | undefined) => void;
  selected?: DateRange;
}

export const DateFilter = ({ children, onChange, selected, ...datepickerProps }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = () => setIsOpen((o) => !o);
  const ref = useRef(null);

  useOnClickOutside(() => setIsOpen(false), ref);

  const isSelected = isSetDateRange(selected);
  const Icon = isSelected ? FunnelFillIcon : FunnelIcon;
  const title = isSelected
    ? `${format(selected.from, PRETTY_FORMAT)} - ${format(selected.to, PRETTY_FORMAT)}`
    : 'Velg periode';

  return (
    <div ref={ref} className="relative" style={{ gridArea: GridArea.DATE }}>
      <Button
        data-color="neutral"
        onClick={onClick}
        size="small"
        variant="tertiary"
        icon={<Icon aria-hidden />}
        title={title}
      >
        {children}
      </Button>

      {isOpen ? (
        <Box
          background="raised"
          shadow="dialog"
          borderRadius="4"
          position="absolute"
          left="space-0"
          className="top-full z-1"
        >
          <HStack align="center" gap="space-8" paddingInline="space-12" paddingBlock="space-12 space-0" wrap={false}>
            <BodyShort className="grow">{formatDateRange(selected)}</BodyShort>
            <Button
              data-color="neutral"
              size="small"
              variant="secondary"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              title="Nullstill"
              icon={<ArrowCirclepathIcon aria-hidden />}
            />
            <Button
              data-color="neutral"
              size="small"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              title="Lukk"
              icon={<XMarkIcon aria-hidden />}
            />
          </HStack>
          <DatePicker.Standalone {...datepickerProps} selected={selected} mode="range" onSelect={onChange} />
        </Box>
      ) : null}
    </div>
  );
};

type RequiredDateRange<T> = {
  [P in keyof T]-?: Date;
};

const isSetDateRange = (range: DateRange | undefined): range is RequiredDateRange<DateRange> =>
  range !== undefined && range.from !== undefined && typeof range.to !== 'undefined';

const formatDateRange = (range: DateRange | undefined) => {
  if (range === undefined || range.from === undefined || range.to === undefined) {
    return 'Ingen periode valgt';
  }

  return (
    <>
      <Time date={range.from} /> - <Time date={range.to} />
    </>
  );
};

interface TimeProps {
  date: Date;
}

const Time = ({ date }: TimeProps) => <time dateTime={formatISO(date)}>{format(date, 'dd.MM.yyyy')}</time>;
