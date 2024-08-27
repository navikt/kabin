import { Tag } from '@navikt/ds-react';
import { addMonths, differenceInDays, differenceInMonths, isEqual, isValid } from 'date-fns';
import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { InfoItem, Time } from '@app/pages/status/common-components';
import { monthUnit, weekUnit } from '@app/pages/status/helpers';

interface Props {
  label: string;
  date: string | null;
  children?: string;
}

export const DateInfoItem = ({ date, label, children }: Props) => {
  if (date === null) {
    return <InfoItem label={label}>Ikke satt</InfoItem>;
  }

  return (
    <InfoItem label={label}>
      <Row>
        <Time dateTime={date}>{isoDateToPretty(date) ?? date}</Time>
        {children === undefined ? null : (
          <Tag variant="neutral" size="small">
            {children}
          </Tag>
        )}
      </Row>
    </InfoItem>
  );
};

export const getDifference = (from: Date, to: Date): string => {
  if (!isValid(from) || !isValid(to)) {
    return 'Ugyldig dato';
  }

  const months = getMonthsDiff(from, to);
  const weeks = getWeeksDiff(from, to);

  if (months === 0) {
    return `${weeks} ${weekUnit(weeks)}`;
  }

  if (weeks === 0) {
    return `${months} ${monthUnit(months)}`;
  }

  return `${weeks} ${weekUnit(weeks)} eller ${months} ${monthUnit(months)}`;
};

const getMonthsDiff = (from: Date, to: Date) => {
  const months = differenceInMonths(to, from);

  if (months === 0) {
    return 0;
  }

  const checkDate = addMonths(from, months);

  return isEqual(checkDate, to) ? months : 0;
};

const getWeeksDiff = (from: Date, to: Date) => {
  const days = differenceInDays(to, from);

  if (days % 7 === 0) {
    return days / 7;
  }

  return 0;
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;
