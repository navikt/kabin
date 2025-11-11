import { Fristdato } from '@app/components/edit-frist/calculated-fristdato';
import { UnitType } from '@app/components/edit-frist/unit-type';
import { Units } from '@app/components/edit-frist/units';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetBehandlingstidMutation } from '@app/redux/api/overstyringer/overstyringer';
import { getDefaultBehandlingstid } from '@app/redux/api/svarbrev/svarbrev';
import { BEHANDLINGSTID_UNIT_TYPE_NAMES, BehandlingstidUnitType } from '@app/types/calculate-frist';
import { Heading, Label } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';

export const EditFrist = () => {
  const { typeId } = useRegistrering();

  if (typeId === null) {
    return null;
  }

  return <LoadedEditFrist />;
};

const LoadedEditFrist = () => {
  const { id, overstyringer, typeId } = useRegistrering();
  const { behandlingstid } = overstyringer;
  const [setBehandlingstid] = useSetBehandlingstidMutation();
  const canEdit = useCanEdit();

  const onUnitChange = useCallback(
    (units: number) =>
      setBehandlingstid({ id, units, unitTypeId: behandlingstid?.unitTypeId ?? BehandlingstidUnitType.WEEKS }),
    [behandlingstid?.unitTypeId, id, setBehandlingstid],
  );

  const onUnitTypeChange = useCallback(
    (unitTypeId: BehandlingstidUnitType) =>
      setBehandlingstid({
        id,
        units: behandlingstid?.units ?? getDefaultBehandlingstid(typeId, unitTypeId),
        unitTypeId,
      }),
    [behandlingstid?.units, id, setBehandlingstid, typeId],
  );

  const unitType = behandlingstid?.unitTypeId ?? BehandlingstidUnitType.WEEKS;
  const units = behandlingstid?.units ?? getDefaultBehandlingstid(typeId, unitType);

  return (
    <Container aria-labelledby="fristIKabal">
      <Label as={Heading} size="small" id="fristIKabal">
        Frist i Kabal
      </Label>

      <Row>
        {canEdit ? (
          <>
            <Units label="Antall" value={units} onChange={onUnitChange} />
            <UnitType value={unitType} onChange={onUnitTypeChange} />
          </>
        ) : (
          <span>
            {units} {BEHANDLINGSTID_UNIT_TYPE_NAMES[unitType]}
          </span>
        )}

        <Fristdato date={overstyringer?.calculatedFrist} />
      </Row>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding-left: 16px;
  border-left: var(--ax-border-neutral-subtle) solid 1px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
`;
