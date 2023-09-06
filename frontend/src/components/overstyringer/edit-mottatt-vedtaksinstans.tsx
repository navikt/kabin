import { parseISO } from 'date-fns';
import React, { useCallback, useContext, useMemo } from 'react';
import { Datepicker } from '@app/components/date-picker/date-picker';
import { FIELD_NAMES } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { ValidationFieldNames } from '@app/types/validation';

export const EditMottattVedtaksinstans = () => {
  const { type, payload, journalpost } = useContext(ApiContext);

  if (type !== Type.KLAGE || journalpost === null) {
    return null;
  }

  return (
    <RenderEditMottattNAV value={payload.overstyringer.mottattVedtaksinstans} toDate={journalpost.datoOpprettet} />
  );
};

interface Props {
  value: string | null;
  toDate: string | null;
}

const RenderEditMottattNAV = ({ value, toDate }: Props) => {
  const { type, updatePayload } = useContext(ApiContext);
  const error = useValidationError(ValidationFieldNames.MOTTATT_VEDTAKSINSTANS);

  const parsedValue = useMemo(() => (value === null ? undefined : parseISO(value)), [value]);
  const parsedToDate = useMemo(() => (toDate === null ? undefined : parseISO(toDate)), [toDate]);

  const onChange = useCallback(
    (mottattVedtaksinstans: string | null) => {
      if (type === Type.NONE) {
        return;
      }

      updatePayload({ overstyringer: { mottattVedtaksinstans } });
    },
    [type, updatePayload],
  );

  return (
    <div>
      <Datepicker
        label={FIELD_NAMES[ValidationFieldNames.MOTTATT_VEDTAKSINSTANS]}
        onChange={onChange}
        value={parsedValue}
        size="small"
        toDate={parsedToDate}
        id={ValidationFieldNames.MOTTATT_VEDTAKSINSTANS}
        error={error}
      />
    </div>
  );
};
