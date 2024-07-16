import { BodyShort, Label, Loader } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { getSvarbrevSettings } from '@app/components/overstyringer/edit-frist/get-svarbrev-settings';
import { isoDateToPretty } from '@app/domain/date';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { useCalculateFristdato, useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { CalculateFristdatoParams } from '@app/types/calculate-frist';
import { skipToken } from '@app/types/common';

export const Fristdato = ({ disabled }: { disabled: boolean }) => {
  const { type } = useContext(AppContext);
  const params = useParams();

  const { data: fristdato, isLoading } = useCalculateFristdato(params);

  if (type === Type.NONE) {
    return null;
  }

  return (
    <StyledFristdato $disabled={disabled}>
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

const useParams = (): CalculateFristdatoParams | typeof skipToken => {
  const { type, state } = useContext(AppContext);
  const { data } = useSvarbrevSettings(state?.overstyringer.ytelseId ?? skipToken);

  if (type === Type.NONE || data === undefined || state.overstyringer.mottattKlageinstans === null) {
    return skipToken;
  }

  const svarbrevSettings = getSvarbrevSettings(data, type);

  if (svarbrevSettings === null) {
    return skipToken;
  }

  const varsletBehandlingstidUnits = state.svarbrev.varsletBehandlingstidUnits ?? svarbrevSettings.behandlingstidUnits;
  const varsletBehandlingstidUnitType =
    state.svarbrev.varsletBehandlingstidUnitType ?? svarbrevSettings.behandlingstidUnitType;

  return {
    fromDate: state.overstyringer.mottattKlageinstans,
    varsletBehandlingstidUnits,
    varsletBehandlingstidUnitType,
  };
};

const StyledFristdato = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
`;
