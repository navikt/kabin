import { CalculatorIcon } from '@navikt/aksel-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';
import { addMonths, addWeeks, format, parse } from 'date-fns';
import { useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { useCalculateFristdato } from '@app/simple-api-state/use-api';
import { BehandlingstidUnitType, CalculateFristdatoParams } from '@app/types/calculate-frist';
import { skipToken } from '@app/types/common';

interface Props {
  units: number;
  unitType: BehandlingstidUnitType;
}

export const Fristdato = ({ units, unitType }: Props) => {
  const { type, state } = useContext(AppContext);

  const params: CalculateFristdatoParams | typeof skipToken = useMemo(() => {
    if (type === Type.NONE || state.overstyringer.mottattKlageinstans === null) {
      return skipToken;
    }

    return {
      fromDate: state.overstyringer.mottattKlageinstans,
      varsletBehandlingstidUnits: units,
      varsletBehandlingstidUnitTypeId: unitType,
    };
  }, [state?.overstyringer.mottattKlageinstans, type, unitType, units]);

  const fristdato = useOptimisticCalculateFristdato(params);

  if (fristdato === null || type === Type.NONE || state.overstyringer.mottattKlageinstans === null) {
    return null;
  }

  return (
    <Tooltip content="Beregnet fristdato">
      <BodyShort as="time" dateTime={fristdato}>
        <Content>
          <CalculatorIcon aria-hidden />
          {isoDateToPretty(fristdato) ?? '-'}
        </Content>
      </BodyShort>
    </Tooltip>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  color: var(--a-text-subtle);
`;

const DATE_FORMAT = 'yyyy-MM-dd';

const useOptimisticCalculateFristdato = (params: CalculateFristdatoParams | typeof skipToken): string | null => {
  const { data, isLoading } = useCalculateFristdato(params);

  if (params === skipToken) {
    return null;
  }

  if (isLoading || data === undefined) {
    const { fromDate, varsletBehandlingstidUnitTypeId, varsletBehandlingstidUnits } = params;
    const parsedFromDate = parse(fromDate, DATE_FORMAT, new Date());

    switch (varsletBehandlingstidUnitTypeId) {
      case BehandlingstidUnitType.WEEKS:
        return format(addWeeks(parsedFromDate, varsletBehandlingstidUnits), DATE_FORMAT);
      case BehandlingstidUnitType.MONTHS:
        return format(addMonths(parsedFromDate, varsletBehandlingstidUnits), DATE_FORMAT);
    }
  }

  return data;
};
