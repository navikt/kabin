import { isoDateTimeToPretty } from '@app/domain/date';

interface Props {
  dateTime: string;
}

export const DateTime = ({ dateTime }: Props) => <time dateTime={dateTime}>{isoDateTimeToPretty(dateTime)}</time>;
