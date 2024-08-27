import { monthUnit, weekUnit } from '@app/pages/status/helpers';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';

export const getDuration = (units: number, unitTypeId: BehandlingstidUnitType) => {
  switch (unitTypeId) {
    case BehandlingstidUnitType.WEEKS:
      return `${units} ${weekUnit(units)}`;
    case BehandlingstidUnitType.MONTHS:
      return `${units} ${monthUnit(units)}`;
  }
};
