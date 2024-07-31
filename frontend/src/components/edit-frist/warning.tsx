import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { addMonths, addWeeks, differenceInMonths, isValid, parseISO } from 'date-fns';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useGetSvarbrevSettingQuery } from '@app/redux/api/svarbrev-settings';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { SaksTypeEnum } from '@app/types/common';

interface Props {
  unitTypeId: BehandlingstidUnitType;
  units: number;
}

export const Warning = ({ unitTypeId, units }: Props) => {
  const ytelseId = useYtelseId();
  const { typeId, mulighet } = useMulighet();
  const { data: svarbrevSetting } = useGetSvarbrevSettingQuery(
    typeId === null || ytelseId === null ? skipToken : { ytelseId, typeId },
  );

  if (typeId === null || svarbrevSetting === undefined || typeId === SaksTypeEnum.KLAGE || mulighet === undefined) {
    return;
  }

  const { vedtakDate } = mulighet;

  if (vedtakDate === null) {
    return null;
  }

  const mottattKlageinstansDate = parseISO(vedtakDate);

  if (!isValid(mottattKlageinstansDate)) {
    return null;
  }

  const overstyringUnits = units ?? svarbrevSetting.behandlingstidUnits;
  const overstyringUnitType = unitTypeId ?? svarbrevSetting.behandlingstidUnitTypeId;

  const overstyringFristdato = getFristDate(overstyringUnits, overstyringUnitType, mottattKlageinstansDate);
  const svarbrevFristdato = getFristDate(
    svarbrevSetting.behandlingstidUnits,
    svarbrevSetting.behandlingstidUnitTypeId,
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
