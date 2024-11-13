import { Fritekst } from '@app/components/edit-frist/fritekst';
import { Container, TopRow } from '@app/components/edit-frist/styled-components';
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
import { ToggleGroup } from '@navikt/ds-react';

const ID = 'svarbrev-frist';
const LABEL = 'Frist i svarbrev';

interface Props {
  setting: SvarbrevSetting;
}

export const EditVarsletFrist = ({ setting }: Props) => {
  const registrering = useRegistrering();
  const [setBehandlingstid] = useSetSvarbrevBehandlingstidMutation();
  const [setOverrideBehandlingstid] = useSetSvarbrevOverrideBehandlingstidMutation();
  const canEdit = useCanEdit();

  if (!canEdit) {
    const { behandlingstid } = registrering.svarbrev;
    const value =
      behandlingstid === null
        ? null
        : `${behandlingstid.units} ${BEHANDLINGSTID_UNIT_TYPE_NAMES[behandlingstid.unitTypeId]}`;

    return <ReadOnlyText label={LABEL} value={value} id={ID} />;
  }

  const { id } = registrering;

  const units = registrering.svarbrev.behandlingstid?.units ?? setting.behandlingstidUnits;
  const unitTypeId = registrering.svarbrev.behandlingstid?.unitTypeId ?? setting.behandlingstidUnitTypeId;

  const setUnits = (u: number) => setBehandlingstid({ id, units: u, unitTypeId });

  const setUnitType = (type: BehandlingstidUnitType) => setBehandlingstid({ id, units, unitTypeId: type });

  const disabled = registrering.svarbrev.overrideBehandlingstid === false;

  return (
    <Container>
      <TopRow>
        <ToggleGroup
          value={registrering.svarbrev.overrideBehandlingstid ? 'true' : 'false'}
          onChange={(m) => setOverrideBehandlingstid({ id, overrideBehandlingstid: m === 'true' })}
          size="small"
          label="Frist i svarbrev"
        >
          <ToggleGroup.Item value="false" label="Uendret" />
          <ToggleGroup.Item value="true" label="Overstyr" />
        </ToggleGroup>

        <Units label="Antall" readOnly={disabled} value={units} onChange={setUnits} />

        <UnitType disabled={disabled} value={unitTypeId} onChange={setUnitType} />

        <Fritekst />
      </TopRow>

      {!disabled ? <Warning units={units} unitTypeId={unitTypeId} /> : null}
    </Container>
  );
};
