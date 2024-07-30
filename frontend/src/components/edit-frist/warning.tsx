import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { addMonths, addWeeks, differenceInMonths, isValid, parseISO } from 'date-fns';
import { getSvarbrevSettings } from '@app/components/edit-frist/get-svarbrev-settings';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { SaksTypeEnum } from '@app/types/common';

interface Props {
  behandlingstidUnitTypeId: BehandlingstidUnitType;
  behandlingstidUnits: number;
}

export const Warning = ({ behandlingstidUnitTypeId, behandlingstidUnits }: Props) => {
  const registrering = useRegistrering();
  const { data } = useSvarbrevSettings(registrering?.overstyringer.ytelseId ?? skipToken);
  const { typeId, mulighet } = useMulighet();

  if (typeId === null) {
    return;
  }

  if (typeId === SaksTypeEnum.KLAGE || mulighet === undefined) {
    return null;
  }

  const { vedtakDate } = mulighet;

  if (vedtakDate === null) {
    return null;
  }

  const svarbrevSettings = getSvarbrevSettings(data, registrering.typeId);

  if (svarbrevSettings === null) {
    return;
  }

  const mottattKlageinstansDate = parseISO(vedtakDate);

  if (!isValid(mottattKlageinstansDate)) {
    return null;
  }

  const overstyringUnits = behandlingstidUnits ?? svarbrevSettings.behandlingstidUnits;
  const overstyringUnitType = behandlingstidUnitTypeId ?? svarbrevSettings.behandlingstidUnitTypeId;

  const overstyringFristdato = getFristDate(overstyringUnits, overstyringUnitType, mottattKlageinstansDate);
  const svarbrevFristdato = getFristDate(
    svarbrevSettings.behandlingstidUnits,
    svarbrevSettings.behandlingstidUnitTypeId,
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
