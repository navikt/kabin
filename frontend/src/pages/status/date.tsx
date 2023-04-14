import React from 'react';
import { isoDateToPretty } from '@app/domain/date';
import { InfoItem, Time } from './common-components';

interface Props {
  title: string;
  date: string;
}

export const DateInfoItem = ({ date, title }: Props) => (
  <InfoItem label={title}>
    <Time dateTime={date}>{isoDateToPretty(date) ?? date}</Time>
  </InfoItem>
);
