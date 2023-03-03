import { Detail, Label, TextField, ToggleGroup } from '@navikt/ds-react';
import { addWeeks, format, parseISO } from 'date-fns';
import React, { useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { FieldNames } from '../../hooks/use-field-name';
import { useValidationError } from '../../hooks/use-validation-error';
import { AnkeContext } from '../../pages/create/anke-context';
import { Card } from '../card/card';
import { Datepicker } from '../date-picker/date-picker';
import { PRETTY_FORMAT } from '../date-picker/formats';
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
    <Row>
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
      <StyledToggleGroup value={fristInWeeks.toString(10)} onChange={parseAndSet} size="small">
        <PresetButton value={6} />
        <PresetButton value={8} />
        <PresetButton value={12} />
        <PresetButton value={16} />
        <PresetButton value={20} />
      </StyledToggleGroup>

      <Fristdato />
    </Row>
  );
};

const Fristdato = () => {
  const { mottattNav, fristInWeeks } = useContext(AnkeContext);

  if (mottattNav === null) {
    return null;
  }

  const fristDato = addWeeks(new Date(mottattNav), fristInWeeks);

  return (
    <StyledFristdato>
      <Label size="small">Beregnet fristdato:</Label>
      <Detail>
        <time dateTime={fristDato.toISOString()}>{format(fristDato, PRETTY_FORMAT)}</time>
      </Detail>
    </StyledFristdato>
  );
};

interface PresetButtonProps {
  value: number;
}

const PresetButton = ({ value }: PresetButtonProps) => {
  const valueAsString = value.toString(10);

  return <ToggleGroup.Item value={valueAsString}>{valueAsString} uker</ToggleGroup.Item>;
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 12px;
  grid-column: frist;
`;

const StyledToggleGroup = styled(ToggleGroup)`
  white-space: nowrap;
  align-self: flex-end;
`;

const StyledFristdato = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  gap: 4px;
`;
