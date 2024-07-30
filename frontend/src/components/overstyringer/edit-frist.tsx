import { Heading, Label } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';
import { Fristdato } from '@app/components/edit-frist/calculated-fristdato';
import { UnitType } from '@app/components/edit-frist/unit-type';
import { Units } from '@app/components/edit-frist/units';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetBehandlingstidMutation } from '@app/redux/api/overstyringer';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';

export const EditFrist = () => {
  const { typeId } = useRegistrering();

  if (typeId === null) {
    return null;
  }

  return <LoadedEditFrist />;
};

const LoadedEditFrist = () => {
  const { id, overstyringer } = useRegistrering();
  const { behandlingstid } = overstyringer;
  const [setBehandlingstid] = useSetBehandlingstidMutation();

  const onUnitChange = useCallback(
    (units: number) =>
      setBehandlingstid({ id, units, unitType: behandlingstid?.unitType ?? BehandlingstidUnitType.WEEKS }),
    [behandlingstid?.unitType, id, setBehandlingstid],
  );

  const onUnitTypeChange = useCallback(
    (unitType: BehandlingstidUnitType) => setBehandlingstid({ id, units: behandlingstid?.units ?? 12, unitType }),
    [behandlingstid?.units, id, setBehandlingstid],
  );

  const units = behandlingstid?.units ?? 12;
  const unitType = behandlingstid?.unitType ?? BehandlingstidUnitType.WEEKS;

  return (
    <Container aria-labelledby="fristIKabal">
      <Label as={Heading} size="small" id="fristIKabal">
        Frist i Kabal
      </Label>

      <Row>
        <Units label="Antall" value={units} onChange={onUnitChange} />

        <UnitType value={unitType} onChange={onUnitTypeChange} />

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
