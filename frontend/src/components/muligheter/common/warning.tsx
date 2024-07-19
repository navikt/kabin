import { Alert } from '@navikt/ds-react';
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

  return (
    <Alert variant="error" size="small">
      Vedtaksdato kan ikke være etter dato for valgt journalpost.
    </Alert>
  );
};
