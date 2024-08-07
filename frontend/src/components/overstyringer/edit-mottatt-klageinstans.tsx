import { parseISO } from 'date-fns';
import { useCallback, useContext, useMemo } from 'react';
import { Datepicker } from '@app/components/date-picker/date-picker';
import { FORMAT } from '@app/domain/date-formats';
import { FIELD_NAMES } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { IAnkeState, IKlageState, Type } from '@app/pages/create/app-context/types';
import { IArkivertDocument } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';

export const EditMottattKlageinstans = () => {
  const { type, state, journalpost } = useContext(AppContext);

  switch (type) {
    case Type.KLAGE:
      return <Klage state={state} journalpost={journalpost} />;
    case Type.ANKE:
      return <Anke state={state} journalpost={journalpost} />;
    case Type.NONE:
      return <RenderEditMottattNAV value={undefined} fromDate={undefined} toDate={undefined} />;
  }
};

interface KlageProps {
  state: IKlageState;
  journalpost: IArkivertDocument | null;
}

const Klage = ({ state, journalpost }: KlageProps) => {
  const selectedDate = getSelectedDate(state);

  const fromDate = journalpost === null ? undefined : parseISO(journalpost.datoOpprettet.substring(0, FORMAT.length));

  const toDate = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return now;
  }, []);

  return <RenderEditMottattNAV value={selectedDate} fromDate={fromDate} toDate={toDate} />;
};

interface AnkeProps {
  state: IAnkeState;
  journalpost: IArkivertDocument | null;
}

const Anke = ({ state, journalpost }: AnkeProps) => {
  const selectedDate = getSelectedDate(state);

  const fromDate =
    state.mulighet === null || state.mulighet.vedtakDate === null ? undefined : parseISO(state.mulighet.vedtakDate);

  const toDate = journalpost === null ? undefined : parseISO(journalpost.datoOpprettet.substring(0, FORMAT.length));

  return <RenderEditMottattNAV value={selectedDate} fromDate={fromDate} toDate={toDate} />;
};

const getSelectedDate = (state: IKlageState | IAnkeState) =>
  state.overstyringer.mottattKlageinstans === null ? undefined : parseISO(state.overstyringer.mottattKlageinstans);

interface Props {
  value: Date | undefined;
  toDate: Date | undefined;
  fromDate: Date | undefined;
}

const RenderEditMottattNAV = ({ value, toDate, fromDate }: Props) => {
  const { type, updateState } = useContext(AppContext);
  const error = useValidationError(ValidationFieldNames.MOTTATT_KLAGEINSTANS);

  const onChange = useCallback(
    (mottattKlageinstans: string | null) => {
      if (type === Type.NONE) {
        return;
      }
      updateState({ overstyringer: { mottattKlageinstans } });
    },
    [type, updateState],
  );

  return (
    <div>
      <Datepicker
        label={FIELD_NAMES[ValidationFieldNames.MOTTATT_KLAGEINSTANS]}
        onChange={onChange}
        value={value}
        size="small"
        toDate={toDate}
        fromDate={fromDate}
        id={ValidationFieldNames.MOTTATT_KLAGEINSTANS}
        error={error}
      />
    </div>
  );
};
