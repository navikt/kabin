import { ToggleGroup } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import {
  BEHANDLINGSTID_UNIT_TYPES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BehandlingstidUnitType,
  isVarsletBehandlingstidUnitType,
} from '@app/types/calculate-frist';

interface Props {
  value: BehandlingstidUnitType;
  onChange: (value: BehandlingstidUnitType) => void;
  label: string;
  disabled?: boolean;
}

export const UnitType = ({ disabled = false, value, onChange, label }: Props) => (
  <StyledToggleGroup
    value={value}
    onChange={(v) => {
      if (isVarsletBehandlingstidUnitType(v)) {
        onChange(v);
      }
    }}
    size="small"
    variant="neutral"
    $disabled={disabled}
    aria-disabled={disabled}
    aria-readonly={disabled}
    label={label}
  >
    {BEHANDLINGSTID_UNIT_TYPES.map((t) => (
      <ToggleButton
        key={t}
        value={t}
        label={BEHANDLINGSTID_UNIT_TYPE_NAMES[t]}
        // @ts-expect-error missing type in ds-react
        disabled={disabled}
        $disabled={disabled}
        aria-disabled={disabled}
      />
    ))}
  </StyledToggleGroup>
);

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
