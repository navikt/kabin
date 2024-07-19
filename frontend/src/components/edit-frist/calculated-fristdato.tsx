import { CalculatorIcon } from '@navikt/aksel-icons';
import { BodyShort, Loader, Tooltip } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
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
      varsletBehandlingstidUnitType: unitType,
    };
  }, [state?.overstyringer.mottattKlageinstans, type, unitType, units]);

  const { data: fristdato, isLoading } = useCalculateFristdato(params);

  if (type === Type.NONE || state.overstyringer.mottattKlageinstans === null) {
    return null;
  }

  return isLoading ? (
    <Loader size="xsmall" />
  ) : (
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
