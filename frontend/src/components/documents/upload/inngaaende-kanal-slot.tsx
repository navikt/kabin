import { ToggleItem } from '@app/components/toggle-item/toggle-item';
import { INNGAAENDE_KANAL_COLORS, INNGAAENDE_KANAL_NAMES } from '@app/domain/inngaaende-kanal';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useIsAnkeSource } from '@app/hooks/use-journalpost';
import { useSetInngaaendeKanalMutation } from '@app/redux/api/registreringer/documents';
import { InngaaendeKanal } from '@app/redux/api/registreringer/types';
import { Tag, ToggleGroup, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';

interface InngaaendeKanalSlotProps {
  registreringId: string;
  inngaaendeKanal: InngaaendeKanal | null;
}

/** The `Source.ANKE` flow is always received through Altinn - the API sets `inngaaendeKanal` as a
 * side effect of selecting the source, so it is shown read-only instead of as a picker. */
export const InngaaendeKanalSlot = ({ registreringId, inngaaendeKanal }: InngaaendeKanalSlotProps) => {
  const canEdit = useCanEdit();
  const isAnkeSource = useIsAnkeSource();
  const [setInngaaendeKanal] = useSetInngaaendeKanalMutation();

  const onChange = useCallback(
    (newInngaaendeKanal: string) => {
      if (!isInngaaendeKanal(newInngaaendeKanal)) {
        return;
      }

      setInngaaendeKanal({ id: registreringId, inngaaendeKanal: newInngaaendeKanal });
    },
    [registreringId, setInngaaendeKanal],
  );

  if (isAnkeSource) {
    return (
      <Tooltip content="Inngående kanal">
        <Tag variant="outline" size="small" data-color={INNGAAENDE_KANAL_COLORS[InngaaendeKanal.ALTINN_INNBOKS]}>
          {INNGAAENDE_KANAL_NAMES[InngaaendeKanal.ALTINN_INNBOKS]}
        </Tag>
      </Tooltip>
    );
  }

  return (
    <Tooltip content="Inngående kanal">
      <ToggleGroup onChange={onChange} value={inngaaendeKanal ?? 'none'} size="small" key={inngaaendeKanal ?? 'none'}>
        <ToggleItem value={InngaaendeKanal.E_POST} disabled={!canEdit}>
          {INNGAAENDE_KANAL_NAMES[InngaaendeKanal.E_POST]}
        </ToggleItem>
        <ToggleItem value={InngaaendeKanal.ALTINN_INNBOKS} disabled={!canEdit}>
          {INNGAAENDE_KANAL_NAMES[InngaaendeKanal.ALTINN_INNBOKS]}
        </ToggleItem>
      </ToggleGroup>
    </Tooltip>
  );
};

const isInngaaendeKanal = (value: string): value is InngaaendeKanal => {
  switch (value) {
    case InngaaendeKanal.ALTINN_INNBOKS:
    case InngaaendeKanal.E_POST:
      return true;
    default:
      return false;
  }
};
