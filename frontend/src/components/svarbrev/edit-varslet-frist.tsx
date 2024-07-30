import { ToggleGroup } from '@navikt/ds-react';
import { Fritekst } from '@app/components/edit-frist/fritekst';
import { Container, TopRow } from '@app/components/edit-frist/styled-components';
import { UnitType } from '@app/components/edit-frist/unit-type';
import { Units } from '@app/components/edit-frist/units';
import { Warning } from '@app/components/edit-frist/warning';
import { useRegistrering } from '@app/hooks/use-registrering';
import {
  useSetSvarbrevBehandlingstidMutation,
  useSetSvarbrevOverrideBehandlingstidMutation,
} from '@app/redux/api/svarbrev';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { SvarbrevSetting } from '@app/types/svarbrev-settings';

interface Props {
  setting: SvarbrevSetting;
}

export const EditVarsletFrist = ({ setting }: Props) => {
  const registrering = useRegistrering();
  const [setBehandlingstid] = useSetSvarbrevBehandlingstidMutation();
  const [setOverrideBehandlingstid] = useSetSvarbrevOverrideBehandlingstidMutation();

  const { id } = registrering;

  const units = registrering.svarbrev.behandlingstid?.units ?? setting.behandlingstidUnits;
  const unitTypeId = registrering.svarbrev.behandlingstid?.unitType ?? setting.behandlingstidUnitTypeId;

  const setUnits = (u: number) => setBehandlingstid({ id, behandlingstid: { units: u, unitTypeId } });

  const setUnitType = (type: BehandlingstidUnitType) =>
    setBehandlingstid({ id, behandlingstid: { units, unitTypeId: type } });

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

        <Units label="Antall" disabled={disabled} value={units} onChange={setUnits} />

        <UnitType disabled={disabled} value={unitTypeId} onChange={setUnitType} />

        <Fritekst />
      </TopRow>

      {!disabled ? <Warning behandlingstidUnits={units} behandlingstidUnitTypeId={unitTypeId} /> : null}
    </Container>
  );
};
