import { ArrowUndoIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import { useCallback, useContext, useState } from 'react';
import { styled } from 'styled-components';
import { toast } from '@app/components/toast/store';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';
import { useSetArkivertDokumentTitleMutation } from '@app/redux/api/journalposter';

interface Props {
  exitEditMode: () => void;
  dokumentInfoId: string;
  journalpostId: string;
  title: string;
}

export const EditTitle = ({ exitEditMode, dokumentInfoId, journalpostId, title }: Props) => {
  const { viewDokument } = useContext(DocumentViewerContext);
  const [setJournalpostTitle] = useSetArkivertDokumentTitleMutation();

  const [newTitle, setNewTitle] = useState(title ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const onSaveClick = useCallback(async () => {
    setIsLoading(true);

    try {
      await setJournalpostTitle({ journalpostId, dokumentInfoId, tittel: newTitle });

      toast.success(`Dokumenttittel endret`);

      viewDokument({ tittel: newTitle, journalpostId, dokumentInfoId });
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`Feil ved endring av dokumenttittel: ${e.message}`);
      }
    }

    setIsLoading(false);
    exitEditMode();
  }, [exitEditMode, setJournalpostTitle, journalpostId, dokumentInfoId, newTitle, viewDokument]);

  const isChanged = title !== newTitle;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        isChanged ? onSaveClick() : exitEditMode();
      }

      if (e.key === 'Escape') {
        exitEditMode();
      }
    },
    [isChanged, onSaveClick, exitEditMode],
  );

  return (
    <>
      <StyledTextField
        value={newTitle}
        onChange={({ target }) => setNewTitle(target.value)}
        label="Endre tittel"
        size="small"
        hideLabel
        autoFocus
        onKeyDown={onKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
        htmlSize={newTitle.length + 1}
      />
      <ButtonContainer>
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<CheckmarkIcon title="Lagre" />}
          onClick={(e) => {
            e.stopPropagation();
            isChanged ? onSaveClick() : exitEditMode();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          loading={isLoading}
        />
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<ArrowUndoIcon title="Avbryt" />}
          onClick={(e) => {
            e.stopPropagation();
            exitEditMode();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </ButtonContainer>
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  overflow: hidden;

  && > input {
    overflow: hidden;
    width: 100%;
  }
`;
