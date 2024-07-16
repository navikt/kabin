import { Tag } from '@navikt/ds-react';
import { addMonths, differenceInDays, differenceInMonths, isEqual, parseISO } from 'date-fns';
import React from 'react';
import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { InfoItem, Time } from './common-components';

interface Props {
  title: string;
  date: string | null;
  base?: Date;
}

export const DateInfoItem = ({ date, base, title }: Props) => {
  if (date === null) {
    return <InfoItem label={title}>Ikke satt</InfoItem>;
  }

  return (
    <InfoItem label={title}>
      <Row>
        <Time dateTime={date}>{isoDateToPretty(date) ?? date}</Time>

        {base === undefined ? null : (
          <Tag variant="neutral" size="small">
            {getDifference(base, parseISO(date))}
          </Tag>
        )}
      </Row>
    </InfoItem>
  );
};

const getDifference = (from: Date, to: Date): string => {
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

const weekUnit = (weeks: number) => (weeks === 1 ? 'uke' : 'uker');
const monthUnit = (months: number) => (months === 1 ? 'måned' : 'måneder');

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
