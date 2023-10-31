import { parseISO } from "date-fns";
import React, { useCallback, useContext, useMemo } from "react";
import { Datepicker } from "@app/components/date-picker/date-picker";
import { FORMAT } from "@app/domain/date-formats";
import { FIELD_NAMES } from "@app/hooks/use-field-name";
import { useValidationError } from "@app/hooks/use-validation-error";
import { ApiContext } from "@app/pages/create/api-context/api-context";
import {
  IAnkeState,
  IKlageState,
  Type,
} from "@app/pages/create/api-context/types";
import { IArkivertDocument } from "@app/types/dokument";

const renderEditMottattNAV = (
  selectedDate: Date | undefined,
  fromDate: Date | undefined,
  toDate: Date | undefined,
) => (
  <RenderEditMottattNAV
    value={selectedDate}
    fromDate={fromDate}
    toDate={toDate}
  />
);
import { ValidationFieldNames } from "@app/types/validation";

export const EditMottattKlageinstans = () => {
  const { type, payload, journalpost } = useContext(ApiContext);

  switch (type) {
    case Type.KLAGE:
      return <Klage payload={payload} journalpost={journalpost} />;
    case Type.ANKE:
      return <Anke payload={payload} journalpost={journalpost} />;
    case Type.NONE:
      return (
        <RenderEditMottattNAV
          value={undefined}
          fromDate={undefined}
          toDate={undefined}
        />
      );
  }
};

interface KlageProps {
  payload: IKlageState;
  journalpost: IArkivertDocument | null;
}

const Klage = ({ payload, journalpost }: KlageProps) => {
  const selectedDate = getSelectedDate(payload);

  const fromDate =
    journalpost === null
      ? undefined
      : parseISO(journalpost.datoOpprettet.substring(0, FORMAT.length));

  const toDate = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return now;
  }, []);

  return renderEditMottattNAV(selectedDate, fromDate, toDate);
};

interface AnkeProps {
  payload: IAnkeState;
  journalpost: IArkivertDocument | null;
}

const Anke = ({ payload, journalpost }: AnkeProps) => {
  const selectedDate = getSelectedDate(payload);

  const fromDate =
    payload.mulighet === null || payload.mulighet.vedtakDate === null
      ? undefined
      : parseISO(payload.mulighet.vedtakDate);

  const toDate =
    journalpost === null
      ? undefined
      : parseISO(journalpost.datoOpprettet.substring(0, FORMAT.length));

  return renderEditMottattNAV(selectedDate, fromDate, toDate);
};

const getSelectedDate = (payload: IKlageState | IAnkeState) =>
  payload.overstyringer.mottattKlageinstans === null
    ? undefined
    : parseISO(payload.overstyringer.mottattKlageinstans);

interface Props {
  value: Date | undefined;
  toDate: Date | undefined;
  fromDate: Date | undefined;
}

const RenderEditMottattNAV = ({ value, toDate, fromDate }: Props) => {
  const { type, updatePayload } = useContext(ApiContext);
  const error = useValidationError(ValidationFieldNames.MOTTATT_KLAGEINSTANS);

  const onChange = useCallback(
    (mottattKlageinstans: string | null) => {
      if (type === Type.NONE) {
        return;
      }
      updatePayload({ overstyringer: { mottattKlageinstans } });
    },
    [type, updatePayload],
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
