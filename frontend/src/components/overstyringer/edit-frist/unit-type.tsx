import { ToggleGroup } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import {
  BEHANDLINGSTID_UNIT_TYPES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BehandlingstidUnitType,
  isVarsletBehandlingstidUnitType,
} from '@app/types/calculate-frist';

interface Props {
  disabled: boolean;
  initialValue: BehandlingstidUnitType;
}

export const UnitType = ({ disabled, initialValue }: Props) => {
  const { type, state, updateState } = useContext(AppContext);

  if (type === Type.NONE) {
    return null;
  }

  return (
    <StyledToggleGroup
      $disabled={disabled}
      value={state.svarbrev.varsletBehandlingstidUnitType ?? initialValue}
      onChange={(v) => {
        if (isVarsletBehandlingstidUnitType(v)) {
          updateState({ svarbrev: { varsletBehandlingstidUnitType: v } });
        }
      }}
      size="small"
      variant="neutral"
      aria-disabled={disabled}
    >
      {BEHANDLINGSTID_UNIT_TYPES.map((t) => (
        <ToggleButton
          key={t}
          value={t}
          label={BEHANDLINGSTID_UNIT_TYPE_NAMES[t]}
          aria-disabled={disabled}
          $disabled={disabled}
          // @ts-expect-error missing type in ds-react
          disabled={disabled}
        />
      ))}
    </StyledToggleGroup>
  );
};

const StyledToggleGroup = styled(ToggleGroup)<{ $disabled: boolean }>`
  align-self: flex-end;

  // Workaround for lacking support of disabled attribute on ToggleGroup
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

// Workaround for lacking support of disabled attribute on ToggleGroup
const ToggleButton = styled(ToggleGroup.Item)<{ $disabled: boolean }>`
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
`;
