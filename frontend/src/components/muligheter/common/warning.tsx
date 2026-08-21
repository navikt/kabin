import { Alert } from '@app/components/alert/alert';
import { isDateAfter } from '@app/functions/date';

interface Props {
  datoOpprettet?: string;
  vedtakDate?: string | null;
}

export const Warning = ({ datoOpprettet, vedtakDate }: Props) => {
  if (typeof datoOpprettet !== 'string' || typeof vedtakDate !== 'string') {
    return null;
  }

  const isInvalid = isDateAfter(vedtakDate, datoOpprettet);

  if (!isInvalid) {
    return null;
  }

  return <Alert variant="error">Vedtaksdato kan ikke være etter dato for valgt journalpost.</Alert>;
};
