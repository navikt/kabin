import { Fritekst } from '@app/components/edit-frist/fritekst';
import { InitialFritekst } from '@app/components/edit-frist/initial-fritekst';
import { Container } from '@app/components/edit-frist/styled-components';
import { UnitType } from '@app/components/edit-frist/unit-type';
import { Units } from '@app/components/edit-frist/units';
import { Warning } from '@app/components/edit-frist/warning';
import { ReadOnlyText } from '@app/components/read-only-info/read-only-info';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import {
  useSetSvarbrevBehandlingstidMutation,
  useSetSvarbrevOverrideBehandlingstidMutation,
} from '@app/redux/api/svarbrev/svarbrev';
import { BEHANDLINGSTID_UNIT_TYPE_NAMES, type BehandlingstidUnitType } from '@app/types/calculate-frist';
import type { SvarbrevSetting } from '@app/types/svarbrev-settings';
import { HGrid, HStack, ToggleGroup } from '@navikt/ds-react';

const ID = 'svarbrev-frist';
const LABEL = 'Frist i svarbrev';

interface Props {
  setting: SvarbrevSetting;
}

export const EditVarsletFrist = ({ setting }: Props) => {
  const { id, typeId, svarbrev } = useRegistrering();
  const [setBehandlingstid] = useSetSvarbrevBehandlingstidMutation();
  const [setOverrideBehandlingstid] = useSetSvarbrevOverrideBehandlingstidMutation();
  const canEdit = useCanEdit();

  if (!canEdit) {
    const { behandlingstid } = svarbrev;
    const value =
      behandlingstid === null
        ? null
        : `${behandlingstid.units} ${BEHANDLINGSTID_UNIT_TYPE_NAMES[behandlingstid.unitTypeId]}`;

    return <ReadOnlyText label={LABEL} value={value} id={ID} />;
  }

  const units = svarbrev.behandlingstid?.units ?? setting.behandlingstidUnits;
  const unitTypeId = svarbrev.behandlingstid?.unitTypeId ?? setting.behandlingstidUnitTypeId;

  const setUnits = (u: number) => setBehandlingstid({ id, units: u, unitTypeId });

  const setUnitType = (type: BehandlingstidUnitType) => setBehandlingstid({ id, units, unitTypeId: type });

  const disabled = svarbrev.overrideBehandlingstid === false;

  return (
    <Container>
      <HGrid columns={2} gap="2">
        <HStack gap="2" align="end">
          <ToggleGroup
            value={svarbrev.overrideBehandlingstid ? 'true' : 'false'}
            onChange={(m) => setOverrideBehandlingstid({ id, overrideBehandlingstid: m === 'true', typeId })}
            size="small"
            label="Frist i svarbrev"
          >
            <ToggleGroup.Item value="false" label="Uendret" />
            <ToggleGroup.Item value="true" label="Overstyr" />
          </ToggleGroup>

          <Units label="Antall" readOnly={disabled} value={units} onChange={setUnits} />

          <UnitType disabled={disabled} value={unitTypeId} onChange={setUnitType} />
        </HStack>

        <InitialFritekst />
      </HGrid>

      <Fritekst />

      {!disabled ? <Warning units={units} unitTypeId={unitTypeId} /> : null}
    </Container>
  );
};
