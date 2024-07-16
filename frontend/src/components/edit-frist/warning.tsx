import { Alert } from '@navikt/ds-react';
import { addMonths, addWeeks, differenceInMonths, isValid, parseISO } from 'date-fns';
import React, { useContext } from 'react';
import { getSvarbrevSettings } from '@app/components/edit-frist/get-svarbrev-settings';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { skipToken } from '@app/types/common';

interface Props {
  behandlingstidUnitType: BehandlingstidUnitType;
  behandlingstidUnits: number;
}

export const Warning = ({ behandlingstidUnitType, behandlingstidUnits }: Props) => {
  const { state, type } = useContext(AppContext);
  const { data } = useSvarbrevSettings(state?.overstyringer.ytelseId ?? skipToken);

  if (state === null) {
    return;
  }

  const { mottattKlageinstans } = state.overstyringer;

  if (mottattKlageinstans === null) {
    return null;
  }

  const svarbrevSettings = getSvarbrevSettings(data, type);

  if (svarbrevSettings === null) {
    return;
  }

  const mottattKlageinstansDate = parseISO(mottattKlageinstans);

  if (!isValid(mottattKlageinstansDate)) {
    return null;
  }

  const overstyringUnits = behandlingstidUnits ?? svarbrevSettings.behandlingstidUnits;
  const overstyringUnitType = behandlingstidUnitType ?? svarbrevSettings.behandlingstidUnitType;

  const overstyringFristdato = getFristDate(overstyringUnits, overstyringUnitType, mottattKlageinstansDate);
  const svarbrevFristdato = getFristDate(
    svarbrevSettings.behandlingstidUnits,
    svarbrevSettings.behandlingstidUnitType,
    mottattKlageinstansDate,
  );

  if (Math.abs(differenceInMonths(overstyringFristdato, svarbrevFristdato)) > 5) {
    return (
      <Alert size="small" variant="warning">
        Du har endret foreslått frist med <strong>mer enn seks måneder</strong>. Er du sikker på at dette er riktig?
      </Alert>
    );
  }

  return null;
};

const getFristDate = (units: number, unitType: BehandlingstidUnitType, mottattKlageinstansDate: Date) => {
  switch (unitType) {
    case BehandlingstidUnitType.MONTHS:
      return addMonths(mottattKlageinstansDate, units);
    case BehandlingstidUnitType.WEEKS:
      return addWeeks(mottattKlageinstansDate, units);
  }
};
