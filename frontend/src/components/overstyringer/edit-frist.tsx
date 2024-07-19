import { Heading, Label } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { Fristdato } from '@app/components/edit-frist/calculated-fristdato';
import { UnitType } from '@app/components/edit-frist/unit-type';
import { Units } from '@app/components/edit-frist/units';
import { AppContext } from '@app/pages/create/app-context/app-context';
import {
  IAnkeState,
  IAnkeStateUpdate,
  IKlageState,
  IKlageStateUpdate,
  Type,
  UpdateFn,
} from '@app/pages/create/app-context/types';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';

export const EditFrist = () => {
  const { type, state, updateState } = useContext(AppContext);

  if (type === Type.NONE) {
    return null;
  }

  return <LoadedEditFrist type={type} state={state} updateState={updateState} />;
};

interface LoadedEditFristProps {
  type: Type.KLAGE | Type.ANKE;
  state: IKlageState | IAnkeState;
  updateState: UpdateFn<IKlageStateUpdate, IKlageState> | UpdateFn<IAnkeStateUpdate, IAnkeState>;
}

const LoadedEditFrist = ({ updateState }: LoadedEditFristProps) => {
  const [units, setUnits] = useState(12);
  const [unitType, setUnitType] = useState(BehandlingstidUnitType.WEEKS);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateState({ overstyringer: { behandlingstidUnits: units, behandlingstidUnitType: unitType } });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [unitType, units, updateState]);

  return (
    <Container>
      <Label as={Heading} size="small">
        Frist i Kabal
      </Label>

      <Row>
        <Units label="Antall" value={units} onChange={setUnits} />

        <UnitType value={unitType} onChange={setUnitType} />

        <Fristdato units={units} unitType={unitType} />
      </Row>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding-left: 16px;
  border-left: var(--a-border-subtle) solid 1px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
`;
