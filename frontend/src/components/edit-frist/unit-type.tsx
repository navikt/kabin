import {
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BEHANDLINGSTID_UNIT_TYPES,
  type BehandlingstidUnitType,
  isVarsletBehandlingstidUnitType,
} from '@app/types/calculate-frist';
import { ToggleGroup } from '@navikt/ds-react';

interface Props {
  value: BehandlingstidUnitType;
  onChange: (value: BehandlingstidUnitType) => void;
  disabled?: boolean;
}

export const UnitType = ({ disabled = false, value, onChange }: Props) => (
  <ToggleGroup
    className={`self-end ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer opacity-100'}`}
    value={value}
    onChange={(v) => {
      if (isVarsletBehandlingstidUnitType(v)) {
        onChange(v);
      }
    }}
    size="small"
    variant="neutral"
    aria-disabled={disabled}
    aria-readonly={disabled}
  >
    {BEHANDLINGSTID_UNIT_TYPES.map((t) => (
      <ToggleGroup.Item
        key={t}
        value={t}
        label={BEHANDLINGSTID_UNIT_TYPE_NAMES[t]}
        // @ts-expect-error missing type in ds-react
        disabled={disabled}
        className={disabled ? 'pointer-events-none' : 'pointer-events-auto'}
        aria-disabled={disabled}
      />
    ))}
  </ToggleGroup>
);
