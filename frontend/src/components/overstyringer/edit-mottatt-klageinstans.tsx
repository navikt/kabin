import { format, parseISO } from 'date-fns';
import React, { useCallback, useContext, useMemo } from 'react';
import { Datepicker } from '@app/components/date-picker/date-picker';
import { FORMAT } from '@app/domain/date-formats';
import { FIELD_NAMES, ValidationFieldNames } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';

export const EditMottattKlageinstans = () => {
  const { type, payload, journalpost } = useContext(ApiContext);

  const [fromDate, toDate, currentDate] = useMemo<[string, string, string | null] | [null, null, null]>(() => {
    if (type === Type.NONE || journalpost === null || payload.mulighet === null) {
      return [null, null, null];
    }

    switch (type) {
      case Type.KLAGE:
        return [journalpost.registrert, format(new Date(), FORMAT), payload.overstyringer.mottattKlageinstans];
      case Type.ANKE:
        return [payload.mulighet.vedtakDate, journalpost.registrert, payload.overstyringer.mottattKlageinstans];
    }
  }, [journalpost, payload?.mulighet, payload?.overstyringer.mottattKlageinstans, type]);

  if (currentDate === null) {
    return null;
  }

  return <RenderEditMottattNAV value={currentDate} toDate={toDate} fromDate={fromDate} />;
};

interface Props {
  value: string;
  toDate: string;
  fromDate: string;
}

const RenderEditMottattNAV = ({ value, toDate, fromDate }: Props) => {
  const { type, updatePayload } = useContext(ApiContext);
  const error = useValidationError(ValidationFieldNames.MOTTATT_KLAGEINSTANS);

  const parsedValue = useMemo(() => parseISO(value), [value]);
  const parsedToDate = useMemo(() => parseISO(toDate), [toDate]);
  const parsedFromDate = useMemo(() => parseISO(fromDate), [fromDate]);

  const onChange = useCallback(
    (mottattKlageinstans: string | null) => {
      if (type === Type.NONE) {
        return;
      }

      updatePayload({ overstyringer: { mottattKlageinstans } });
    },
    [type, updatePayload]
  );

  return (
    <div>
      <Datepicker
        label={FIELD_NAMES[ValidationFieldNames.MOTTATT_KLAGEINSTANS]}
        onChange={onChange}
        value={parsedValue}
        size="small"
        toDate={parsedToDate}
        fromDate={parsedFromDate}
        id={ValidationFieldNames.MOTTATT_KLAGEINSTANS}
        error={error}
      />
    </div>
  );
};
