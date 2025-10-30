import { Datepicker } from '@app/components/date-picker/date-picker';
import { ReadOnlyTime } from '@app/components/read-only-info/read-only-info';
import { FORMAT } from '@app/domain/date-formats';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { FIELD_NAMES } from '@app/hooks/use-field-name';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetMottattKlageinstansMutation } from '@app/redux/api/overstyringer/overstyringer';
import { SaksTypeEnum } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';
import { parseISO } from 'date-fns';
import { useCallback, useMemo } from 'react';

const ID = ValidationFieldNames.MOTTATT_KLAGEINSTANS;
const LABEL = FIELD_NAMES[ID];

export const EditMottattKlageinstans = () => {
  const { typeId, overstyringer } = useRegistrering();
  const canEdit = useCanEdit();

  if (!canEdit) {
    return <ReadOnlyTime id={ID} label={LABEL} value={overstyringer.mottattKlageinstans} />;
  }

  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return <FromJournalpostToNow />;
    case SaksTypeEnum.OMGJØRINGSKRAV:
    case SaksTypeEnum.ANKE:
      return <FromVedtakToJournalpost />;
  }

  return null;
};

const FromJournalpostToNow = () => {
  const { overstyringer } = useRegistrering();
  const { journalpost } = useJournalpost();
  const selectedDate = getSelectedDate(overstyringer.mottattKlageinstans);

  const fromDate =
    journalpost === undefined ? undefined : parseISO(journalpost.datoOpprettet.substring(0, FORMAT.length));

  const toDate = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return now;
  }, []);

  return <RenderEditMottattNav value={selectedDate} fromDate={fromDate} toDate={toDate} />;
};

const FromVedtakToJournalpost = () => {
  const { overstyringer } = useRegistrering();
  const { journalpost } = useJournalpost();
  const selectedDate = getSelectedDate(overstyringer.mottattKlageinstans);

  const { mulighet, fromJournalpost } = useMulighet();

  const fromDate =
    mulighet === undefined || fromJournalpost || mulighet.vedtakDate === null
      ? undefined
      : parseISO(mulighet.vedtakDate);

  const toDate =
    journalpost === undefined ? undefined : parseISO(journalpost.datoOpprettet.substring(0, FORMAT.length));

  return <RenderEditMottattNav value={selectedDate} fromDate={fromDate} toDate={toDate} />;
};

const getSelectedDate = (mottattKlageinstans: string | null) =>
  mottattKlageinstans === null ? undefined : parseISO(mottattKlageinstans);

interface Props {
  value?: Date;
  toDate?: Date;
  fromDate?: Date;
}

const RenderEditMottattNav = ({ value, toDate, fromDate }: Props) => {
  const { id } = useRegistrering();
  const [setMottattKlageinstans] = useSetMottattKlageinstansMutation();
  const error = useValidationError(ID);

  const onChange = useCallback(
    (mottattKlageinstans: string | null) => {
      if (mottattKlageinstans === null) {
        return;
      }
      setMottattKlageinstans({ id, mottattKlageinstans });
    },
    [id, setMottattKlageinstans],
  );

  return (
    <Datepicker
      label={LABEL}
      onChange={onChange}
      value={value}
      size="small"
      toDate={toDate}
      fromDate={fromDate}
      id={ValidationFieldNames.MOTTATT_KLAGEINSTANS}
      error={error}
    />
  );
};
