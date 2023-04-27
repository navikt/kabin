import { ErrorMessage } from '@navikt/ds-react';
import React from 'react';

interface Props {
  error?: string;
  id?: string;
}

export const ValidationErrorMessage = ({ error, id }: Props) => {
  if (typeof error === 'undefined') {
    return null;
  }

  return (
    <ErrorMessage id={id} size="small">
      {error}
    </ErrorMessage>
  );
};
