import { Alert } from '@app/components/alert/alert';
import { parseDate } from '@app/functions/date';
import { isAfter } from 'date-fns';

interface Props {
  datoOpprettet?: string;
  vedtakDate?: string | null;
}

export const Warning = ({ datoOpprettet, vedtakDate }: Props) => {
  if (typeof datoOpprettet !== 'string' || typeof vedtakDate !== 'string') {
    return null;
  }

  const isInvalid = isAfter(parseDate(vedtakDate), parseDate(datoOpprettet));

  if (!isInvalid) {
    return null;
  }

  return <Alert variant="error">Vedtaksdato kan ikke være etter dato for valgt journalpost.</Alert>;
};
