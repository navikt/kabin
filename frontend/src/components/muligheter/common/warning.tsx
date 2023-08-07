import { Alert } from '@navikt/ds-react';
import React from 'react';
import { isDateAfter } from '@app/functions/date';

interface Props {
  registrert?: string;
  vedtakDate?: string | null;
}

export const Warning = ({ registrert, vedtakDate }: Props) => {
  if (typeof registrert !== 'string' || typeof vedtakDate !== 'string') {
    return null;
  }

  const isInvalid = isDateAfter(vedtakDate, registrert);

  if (!isInvalid) {
    return null;
  }

  return (
    <Alert variant="error" size="small">
      Vedtaksdato kan ikke være etter dato for valgt journalpost.
    </Alert>
  );
};
