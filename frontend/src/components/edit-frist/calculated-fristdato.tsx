import { BodyShort, Label, Loader } from '@navikt/ds-react';
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

  return (
    <StyledFristdato>
      <Label size="small">Beregnet fristdato</Label>
      {isLoading ? (
        <Loader size="xsmall" />
      ) : (
        <BodyShort as="time" dateTime={fristdato}>
          {isoDateToPretty(fristdato) ?? '-'}
        </BodyShort>
      )}
    </StyledFristdato>
  );
};

const StyledFristdato = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;
