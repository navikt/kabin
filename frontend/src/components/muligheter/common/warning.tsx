import { Alert } from '@navikt/ds-react';
import React from 'react';
import { isDateAfter } from '@app/functions/date';

interface Props {
  mottattDate?: string;
  vedtakDate?: string;
}

export const Warning = ({ mottattDate, vedtakDate }: Props) => {
  if (typeof mottattDate !== 'string' || typeof vedtakDate !== 'string' || isDateAfter(mottattDate, vedtakDate)) {
    return null;
  }

  return (
    <Alert variant="error" size="small">
      Vedtaksdato kan ikke være etter dato for valgt journalpost.
    </Alert>
  );
};
