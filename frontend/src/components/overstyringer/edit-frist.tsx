import { ToggleGroup } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { Fristdato } from '@app/components/overstyringer/edit-frist/calculated-fristdato';
import { Fritekst } from '@app/components/overstyringer/edit-frist/fritekst';
import { getSvarbrevSettings } from '@app/components/overstyringer/edit-frist/get-svarbrev-settings';
import { Skeletons } from '@app/components/overstyringer/edit-frist/skeletons';
import { Container, TopRow } from '@app/components/overstyringer/edit-frist/styled-components';
import { UnitType } from '@app/components/overstyringer/edit-frist/unit-type';
import { Units } from '@app/components/overstyringer/edit-frist/units';
import { Warning } from '@app/components/overstyringer/edit-frist/warning';
import { AppContext } from '@app/pages/create/app-context/app-context';
import {
  IAnkeState,
  IAnkeStateUpdate,
  IKlageState,
  IKlageStateUpdate,
  Type,
  UpdateFn,
} from '@app/pages/create/app-context/types';
import { useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { AnkeSvarbrevSetting, KlageSvarbrevSetting } from '@app/types/svarbrev-settings';

const UENDRET = 'UENDRET';
const OVERSTYR = 'OVERSTYR';

export const EditFrist = () => {
  const { type, state, updateState } = useContext(AppContext);
  const { data: svarbrevSettingsData, isLoading: svarbrevIsLoading } = useSvarbrevSettings(
    state?.overstyringer.ytelseId ?? skipToken,
  );

  if (type === Type.NONE) {
    return null;
  }

  if (svarbrevIsLoading) {
    return <Skeletons />;
  }

  const svarbrevSetting = getSvarbrevSettings(svarbrevSettingsData, type);

  if (svarbrevSetting === null) {
    return null;
  }

  return <LoadedEditFrist type={type} state={state} svarbrevSetting={svarbrevSetting} updateState={updateState} />;
};

interface LoadedEditFristProps {
  type: Type.KLAGE | Type.ANKE;
  state: IKlageState | IAnkeState;
  svarbrevSetting: KlageSvarbrevSetting | AnkeSvarbrevSetting;
  updateState: UpdateFn<IKlageStateUpdate, IKlageState> | UpdateFn<IAnkeStateUpdate, IAnkeState>;
}

const LoadedEditFrist = ({ svarbrevSetting, updateState }: LoadedEditFristProps) => {
  const [editMode, setEditMode] = useState(UENDRET);
  const [fritekst, setFritekst] = useState(svarbrevSetting.customText);

  const disabled = editMode === UENDRET;

  return (
    <Container>
      <TopRow>
        <ToggleGroup
          value={editMode}
          onChange={(m) => {
            if (m === UENDRET) {
              setFritekst(svarbrevSetting.customText);

              updateState({
                svarbrev: {
                  varsletBehandlingstidUnits: svarbrevSetting.behandlingstidUnits,
                  varsletBehandlingstidUnitType: svarbrevSetting.behandlingstidUnitType,
                  customText: svarbrevSetting.customText,
                },
              });
            }
            setEditMode(m);
          }}
          size="small"
          label="Frist"
        >
          <ToggleGroup.Item value={UENDRET} label="Uendret" />
          <ToggleGroup.Item value={OVERSTYR} label="Overstyr" />
        </ToggleGroup>

        <Units disabled={disabled} initialValue={svarbrevSetting.behandlingstidUnits} />

        <UnitType disabled={disabled} initialValue={svarbrevSetting.behandlingstidUnitType} />

        <Fristdato disabled={disabled} />

        <Fritekst disabled={disabled} value={fritekst} onChange={setFritekst} />
      </TopRow>

      <Warning />
    </Container>
  );
};
