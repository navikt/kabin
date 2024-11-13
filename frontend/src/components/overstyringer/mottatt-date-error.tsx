import { useRegistrering } from '@app/hooks/use-registrering';
import { ErrorMessage } from '@navikt/ds-react';
import { isAfter, parseISO } from 'date-fns';

export const MottattDateError = () => {
  const {
    overstyringer: { mottattKlageinstans, mottattVedtaksinstans },
  } = useRegistrering();

  const isAfterMottattKlageinstansError =
    mottattKlageinstans !== null &&
    mottattVedtaksinstans !== null &&
    isAfter(parseISO(mottattVedtaksinstans), parseISO(mottattKlageinstans));

  if (!isAfterMottattKlageinstansError) {
    return null;
  }

  return <ErrorMessage size="small">Mottatt vedtaksinstans kan ikke være etter mottatt klageinstans</ErrorMessage>;
};
