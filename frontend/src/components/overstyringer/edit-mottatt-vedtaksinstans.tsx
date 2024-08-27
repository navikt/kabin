import { parseISO } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { Datepicker } from '@app/components/date-picker/date-picker';
import { ReadOnlyTime } from '@app/components/read-only-info/read-only-info';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { FIELD_NAMES } from '@app/hooks/use-field-name';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetMottattVedtaksinstansMutation } from '@app/redux/api/overstyringer/overstyringer';
import { SaksTypeEnum } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

const ID = ValidationFieldNames.MOTTATT_VEDTAKSINSTANS;
const LABEL = FIELD_NAMES[ID];

export const EditMottattVedtaksinstans = () => {
  const { overstyringer, typeId } = useRegistrering();
  const { journalpost } = useJournalpost();
  const canEdit = useCanEdit();

  const { mottattVedtaksinstans } = overstyringer;

  if (typeId !== SaksTypeEnum.KLAGE || journalpost === undefined) {
    return null;
  }

  if (!canEdit) {
    return <ReadOnlyTime id={ID} label={LABEL} value={mottattVedtaksinstans} />;
  }

  return <RenderEditMottattNAV value={mottattVedtaksinstans} toDate={journalpost.datoOpprettet} />;
};

interface Props {
  value: string | null;
  toDate: string | null;
}

const RenderEditMottattNAV = ({ toDate }: Props) => {
  const error = useValidationError(ID);
  const registrering = useRegistrering();
  const [setMottattVedtaksinstans] = useSetMottattVedtaksinstansMutation();

  const parsedValue = useMemo(
    () =>
      registrering.overstyringer.mottattVedtaksinstans === null
        ? undefined
        : parseISO(registrering.overstyringer.mottattVedtaksinstans),
    [registrering],
  );

  const parsedToDate = useMemo(() => (toDate === null ? undefined : parseISO(toDate)), [toDate]);

  const onChange = useCallback(
    (mottattVedtaksinstans: string | null) => {
      if (registrering === undefined || registrering.typeId === null || mottattVedtaksinstans === null) {
        return;
      }

      setMottattVedtaksinstans({ id: registrering.id, mottattVedtaksinstans });
    },
    [registrering, setMottattVedtaksinstans],
  );

  return (
    <Datepicker
      label={LABEL}
      onChange={onChange}
      value={parsedValue}
      size="small"
      toDate={parsedToDate}
      id={ID}
      error={error}
    />
  );
};
