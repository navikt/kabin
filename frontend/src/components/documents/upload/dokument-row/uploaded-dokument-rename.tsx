import { toast } from '@app/components/toast/store';
import { useSetDokumentNameMutation } from '@app/redux/api/registreringer/documents';
import type { RegistreringDokument } from '@app/redux/api/registreringer/types';
import { ArrowUndoIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, TextField } from '@navikt/ds-react';
import { useCallback, useState } from 'react';

interface Props {
  registreringId: string;
  dokument: RegistreringDokument;
  exitEditMode: () => void;
}

export const UploadedDokumentRename = ({ registreringId, dokument, exitEditMode }: Props) => {
  const [setDokumentName, { isLoading }] = useSetDokumentNameMutation();
  const [newName, setNewName] = useState(dokument.name);

  const isChanged = newName.trim().length > 0 && newName !== dokument.name;

  const onSaveClick = useCallback(async () => {
    if (!isChanged) {
      exitEditMode();

      return;
    }

    try {
      await setDokumentName({ id: registreringId, dokumentId: dokument.id, name: newName }).unwrap();
      exitEditMode();
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`Feil ved endring av filnavn: ${e.message}`);
      }
    }
  }, [setDokumentName, registreringId, dokument.id, newName, isChanged, exitEditMode]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSaveClick();
      }

      if (e.key === 'Escape') {
        exitEditMode();
      }
    },
    [onSaveClick, exitEditMode],
  );

  return (
    <HStack align="center" gap="space-4" wrap={false} className="grow">
      <TextField
        className="grow overflow-hidden"
        value={newName}
        onChange={({ target }) => setNewName(target.value)}
        label="Endre filnavn"
        size="small"
        hideLabel
        autoFocus
        onKeyDown={onKeyDown}
      />
      <Button
        data-color="neutral"
        variant="tertiary"
        size="xsmall"
        icon={<CheckmarkIcon aria-hidden title="Lagre" />}
        onClick={onSaveClick}
        loading={isLoading}
      />
      <Button
        data-color="neutral"
        variant="tertiary"
        size="xsmall"
        icon={<ArrowUndoIcon aria-hidden title="Avbryt" />}
        onClick={exitEditMode}
      />
    </HStack>
  );
};
