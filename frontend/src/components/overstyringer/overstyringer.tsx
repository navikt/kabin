import { Detail, Label, Loader, TextField } from '@navikt/ds-react';
import { parseISO } from 'date-fns';
import React, { useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { FieldNames } from '../../hooks/use-field-name';
import { useValidationError } from '../../hooks/use-validation-error';
import { AnkeContext } from '../../pages/create/anke-context';
import { useCalculateFristdato } from '../../simple-api-state/use-api';
import { skipToken } from '../../types/common';
import { Card } from '../card/card';
import { Datepicker } from '../date-picker/date-picker';
import { Part } from './part';
import { PartRead } from './part-read';
import { GridArea, gridAreas } from './types';

export const Overstyringer = () => {
  const { setMottattNav, ankemulighet, klager, fullmektig, setKlager, setFullmektig } = useContext(AnkeContext);

  useEffect(() => {
    if (ankemulighet === null) {
      setMottattNav(null);
    }
  }, [ankemulighet, setMottattNav]);

  return (
    <Card title="Tilpass anken">
      <Content>
        <EditMottattNAV />
        <EditFrist />
        <StyledHeading size="small">Parter</StyledHeading>
        <PartRead gridArea={GridArea.SAKEN_GJELDER} part={ankemulighet?.sakenGjelder ?? null} label="Saken gjelder" />
        <Part gridArea={GridArea.ANKER} part={klager} setPart={setKlager} label="Ankende part" />
        <Part gridArea={GridArea.FULLMEKTIG} part={fullmektig} setPart={setFullmektig} label="Fullmektig" />
      </Content>
    </Card>
  );
};

const Content = styled.div`
  display: grid;
  grid-template-areas: 'mottattnav frist frist' 'title title title' '${gridAreas.join(' ')}';
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
`;

const EditMottattNAV = () => {
  const { mottattNav, setMottattNav, dokument, ankemulighet } = useContext(AnkeContext);
  const error = useValidationError(FieldNames.MOTTATT_NAV);

  const onChange = useCallback(
    (date: string | null): void => {
      if (date !== null) {
        setMottattNav(date);
      }
    },
    [setMottattNav]
  );

  return (
    <StyledDatepicker
      label="Mottatt NAV Klageinstans"
      onChange={onChange}
      value={mottattNav === null ? undefined : parseISO(mottattNav)}
      size="small"
      toDate={dokument === null ? undefined : parseISO(dokument.registrert)}
      fromDate={ankemulighet === null ? undefined : parseISO(ankemulighet.vedtakDate)}
      id={FieldNames.MOTTATT_NAV}
      error={error}
      disabled={dokument === null}
    />
  );
};

const EditFrist = () => {
  const { fristInWeeks, setFristInWeeks } = useContext(AnkeContext);
  const error = useValidationError(FieldNames.FRIST);

  const parseAndSet = useCallback(
    (value: string): void => {
      const parsed = Number.parseInt(value, 10);

      setFristInWeeks(parsed);
    },
    [setFristInWeeks]
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }): void => parseAndSet(target.value),
    [parseAndSet]
  );

  return (
    <StyledEditFrist>
      <StyledTextField
        type="number"
        label="Frist i uker"
        size="small"
        min={0}
        id={FieldNames.FRIST}
        value={fristInWeeks}
        onChange={onInputChange}
        error={error}
      />
      <Fristdato />
    </StyledEditFrist>
  );
};

const Fristdato = () => {
  const { mottattNav, fristInWeeks } = useContext(AnkeContext);
  const { data: fristdato, isLoading } = useCalculateFristdato(
    mottattNav === null ? skipToken : { fromDate: mottattNav, fristInWeeks }
  );

  if (mottattNav === null) {
    return null;
  }

  return (
    <StyledFristdato>
      <Label size="small">Beregnet fristdato</Label>
      {isLoading ? (
        <Loader size="xsmall" />
      ) : (
        <Detail>
          <time dateTime={fristdato}>{isoDateToPretty(fristdato)}</time>
        </Detail>
      )}
    </StyledFristdato>
  );
};

const StyledDatepicker = styled(Datepicker)`
  grid-area: mottattnav;
`;

const StyledTextField = styled(TextField)`
  grid-area: frist;
  width: 100px;
`;

const StyledHeading = styled(Label)`
  grid-area: title;
`;

const StyledEditFrist = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  grid-column: frist;
`;

const StyledFristdato = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
