import { skipToken } from '@reduxjs/toolkit/query';
import { parseISO } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { Datepicker } from '@app/components/date-picker/date-picker';
import { FIELD_NAMES } from '@app/hooks/use-field-name';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useAppStateStore } from '@app/pages/create/app-context/state';
import { Type } from '@app/pages/create/app-context/types';
import { useGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useSetMottattVedtaksinstansMutation } from '@app/redux/api/overstyringer';
import { useGetRegistreringQuery } from '@app/redux/api/registrering';
import { TypeId } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';

export const EditMottattVedtaksinstans = () => {
  const { data: registrering } = useGetRegistreringQuery(useRegistreringId());
  const { data: journalposter } = useGetArkiverteDokumenterQuery(registrering?.sakenGjelderValue ?? skipToken);

  if (registrering === undefined) {
    return null;
  }

  const journalpost = journalposter?.dokumenter.find((jp) => jp.journalpostId === registrering.journalpostId);

  const { typeId } = registrering;

  if (typeId !== TypeId.KLAGE || journalpost === undefined) {
    return null;
  }

  return (
    <RenderEditMottattNAV value={registrering.overstyringer.mottattVedtaksinstans} toDate={journalpost.datoOpprettet} />
  );
};

interface Props {
  value: string | null;
  toDate: string | null;
}

const RenderEditMottattNAV = ({ toDate }: Props) => {
  const type = useAppStateStore((state) => state.type);
  const error = useValidationError(ValidationFieldNames.MOTTATT_VEDTAKSINSTANS);
  const registreringId = useRegistreringId();
  const { data: registrering } = useGetRegistreringQuery(registreringId);
  const [setMottattVedtaksinstans] = useSetMottattVedtaksinstansMutation();

  const parsedValue = useMemo(
    () =>
      registrering === undefined || registrering.overstyringer.mottattVedtaksinstans === null
        ? undefined
        : parseISO(registrering.overstyringer.mottattVedtaksinstans),
    [registrering],
  );
  const parsedToDate = useMemo(() => (toDate === null ? undefined : parseISO(toDate)), [toDate]);

  const onChange = useCallback(
    (mottattVedtaksinstans: string | null) => {
      if (type === Type.NONE || registreringId === skipToken || mottattVedtaksinstans === null) {
        return;
      }

      setMottattVedtaksinstans({ id: registreringId, mottattVedtaksinstans });
    },
    [type, registreringId, setMottattVedtaksinstans],
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
