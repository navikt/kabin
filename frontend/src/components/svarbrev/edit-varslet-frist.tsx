import { ToggleGroup } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { Fritekst } from '@app/components/edit-frist/fritekst';
import { Container, TopRow } from '@app/components/edit-frist/styled-components';
import { UnitType } from '@app/components/edit-frist/unit-type';
import { Units } from '@app/components/edit-frist/units';
import { Warning } from '@app/components/edit-frist/warning';
import { Svarbrev } from '@app/pages/create/app-context/types';
import { SvarbrevSetting } from '@app/types/svarbrev-settings';

const UENDRET = 'UENDRET';
const OVERSTYR = 'OVERSTYR';

interface Props {
  setting: SvarbrevSetting;
  onChange: (
    svarbrev: Pick<Svarbrev, 'varsletBehandlingstidUnitType' | 'varsletBehandlingstidUnits' | 'customText'>,
  ) => void;
}

export const EditVarsletFrist = ({ setting, onChange }: Props) => {
  const [editMode, setEditMode] = useState(UENDRET);
  const [fritekst, setFritekst] = useState(setting.customText);
  const [units, setUnits] = useState(setting.behandlingstidUnits);
  const [unitType, setUnitType] = useState(setting.behandlingstidUnitType);

  useEffect(() => {
    if (editMode === UENDRET) {
      return;
    }

    const timeout = setTimeout(() => {
      onChange({
        varsletBehandlingstidUnits: units,
        varsletBehandlingstidUnitType: unitType,
        customText: fritekst,
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [editMode, fritekst, onChange, unitType, units]);

  const disabled = editMode === UENDRET;

  return (
    <Container>
      <TopRow>
        <ToggleGroup
          value={editMode}
          onChange={(m) => {
            if (m === UENDRET) {
              setUnits(setting.behandlingstidUnits);
              setUnitType(setting.behandlingstidUnitType);
              setFritekst(setting.customText);

              onChange({
                varsletBehandlingstidUnits: setting.behandlingstidUnits,
                varsletBehandlingstidUnitType: setting.behandlingstidUnitType,
                customText: setting.customText,
              });
            }

            setEditMode(m);
          }}
          size="small"
          label="Frist i svarbrev"
        >
          <ToggleGroup.Item value={UENDRET} label="Uendret" />
          <ToggleGroup.Item value={OVERSTYR} label="Overstyr" />
        </ToggleGroup>

        <Units label="Antall" disabled={disabled} value={units} onChange={setUnits} />

        <UnitType disabled={disabled} value={unitType} onChange={setUnitType} />

        <Fritekst disabled={disabled} value={fritekst} onChange={setFritekst} />
      </TopRow>

      {editMode === OVERSTYR ? <Warning behandlingstidUnits={units} behandlingstidUnitType={unitType} /> : null}
    </Container>
  );
};
