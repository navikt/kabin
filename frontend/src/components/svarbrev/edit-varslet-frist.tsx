import { Fristdato } from '@app/components/edit-frist/calculated-fristdato';
import { Fritekst } from '@app/components/edit-frist/fritekst';
import { InitialFritekst } from '@app/components/edit-frist/initial-fritekst';
import { Container } from '@app/components/edit-frist/layout';
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
import { HStack, Label, ToggleGroup, VStack } from '@navikt/ds-react';

const ID = 'svarbrev-frist';
const LABEL = 'Varslet frist i Kabal-behandling';

interface Props {
  setting: SvarbrevSetting;
}

export const EditVarsletFrist = ({ setting }: Props) => {
  const { svarbrev, id, typeId } = useRegistrering();
  const canEdit = useCanEdit();
  const { units, unitTypeId } = useBehandlingstid(setting);
  const [setOverrideBehandlingstid] = useSetSvarbrevOverrideBehandlingstidMutation();

  if (!canEdit) {
    const { behandlingstid } = svarbrev;
    const value =
      behandlingstid === null
        ? null
        : `${behandlingstid.units} ${BEHANDLINGSTID_UNIT_TYPE_NAMES[behandlingstid.unitTypeId]}`;

    return <ReadOnlyText label={LABEL} value={value} id={ID} />;
  }

  const disabled = svarbrev.overrideBehandlingstid === false;

  return (
    <Container>
      <HStack gap="space-16">
        <HStack gap="space-8" align="end" justify="end">
          <VarsletFristBehandlingstid disabled={disabled} units={units} unitTypeId={unitTypeId} />
          <ToggleGroup
            value={svarbrev.overrideBehandlingstid ? 'true' : 'false'}
            onChange={(m) => setOverrideBehandlingstid({ id, overrideBehandlingstid: m === 'true', typeId })}
            size="small"
            label="Frist i svarbrev"
          >
            <ToggleGroup.Item value="false" label="Uendret" />
            <ToggleGroup.Item value="true" label="Overstyr" />
          </ToggleGroup>
          <Fristdato date={svarbrev.calculatedFrist} />
        </HStack>

        <InitialFritekst />
      </HStack>
      <Fritekst />
      {!disabled ? <Warning units={units} unitTypeId={unitTypeId} /> : null}
    </Container>
  );
};

interface VarsletFristBehandlingstidProps {
  disabled?: boolean;
  units: number;
  unitTypeId: BehandlingstidUnitType;
  label?: string;
}

const FIELDSET_ID = 'varslet-frist-fieldset';

export const VarsletFristBehandlingstid = ({
  disabled = false,
  units,
  unitTypeId,
  label,
}: VarsletFristBehandlingstidProps) => {
  const [setBehandlingstid] = useSetSvarbrevBehandlingstidMutation();
  const { id } = useRegistrering();
  const setUnits = (units: number) => setBehandlingstid({ id, units, unitTypeId });
  const setUnitType = (unitTypeId: BehandlingstidUnitType) => setBehandlingstid({ id, units, unitTypeId });

  return (
    <VStack gap="space-8">
      {label === undefined ? null : (
        <Label size="small" htmlFor={FIELDSET_ID}>
          {label}
        </Label>
      )}
      <HStack gap="space-8" align="end" as="fieldset" id={FIELDSET_ID}>
        <Units label="Antall" readOnly={disabled} value={units} onChange={setUnits} />

        <UnitType disabled={disabled} value={unitTypeId} onChange={setUnitType} />
      </HStack>
    </VStack>
  );
};

export const useBehandlingstid = (setting: SvarbrevSetting) => {
  const { svarbrev } = useRegistrering();

  const units = svarbrev.behandlingstid?.units ?? setting.behandlingstidUnits;
  const unitTypeId = svarbrev.behandlingstid?.unitTypeId ?? setting.behandlingstidUnitTypeId;

  return { units, unitTypeId };
};
