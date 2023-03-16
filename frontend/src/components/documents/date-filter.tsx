import { ArrowCirclepathIcon, FunnelFillIcon, FunnelIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, DatePickerProps, UNSAFE_DatePicker as Datepicker } from '@navikt/ds-react';
import { format, formatISO } from 'date-fns';
import React, { useCallback, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import styled from 'styled-components';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { PRETTY_FORMAT } from '../date-picker/formats';

interface Props extends Pick<DatePickerProps, 'fromDate' | 'toDate'> {
  children: React.ReactNode;
  onChange: (value?: DateRange | undefined) => void;
  selected?: DateRange;
}

export const DateFilter = ({ children, onChange, selected, ...datepickerProps }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = useCallback(() => setIsOpen((o) => !o), [setIsOpen]);
  const ref = useRef(null);

  useOnClickOutside(() => setIsOpen(false), ref);

  const isSelected = isSetDateRange(selected);
  const Icon = isSelected ? FunnelFillIcon : FunnelIcon;
  const title = isSelected
    ? `${format(selected.from, PRETTY_FORMAT)} - ${format(selected.to, PRETTY_FORMAT)}`
    : 'Velg periode';

  return (
    <Container ref={ref}>
      <Button onClick={onClick} size="small" variant="tertiary" icon={<Icon aria-hidden />} title={title}>
        {children}
      </Button>
      {isOpen ? (
        <DatepickerContainer>
          <StyledHeader>
            <StyledDateRange>{formatDateRange(selected)}</StyledDateRange>
            <Button
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
              size="small"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              title="Lukk"
              icon={<XMarkIcon aria-hidden />}
            />
          </StyledHeader>
          <Datepicker.Standalone {...datepickerProps} selected={selected} mode="range" onSelect={onChange} />
        </DatepickerContainer>
      ) : null}
    </Container>
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

const Container = styled.div`
  position: relative;
`;

const DatepickerContainer = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 1;
  background-color: white;
  border-radius: var(--a-border-radius-medium);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: var(--a-spacing-3);
  padding-bottom: 0;
  column-gap: 8px;
`;

const StyledDateRange = styled(BodyShort)`
  flex-grow: 1;
`;
