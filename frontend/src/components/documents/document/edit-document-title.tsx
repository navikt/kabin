import { toast } from '@app/components/toast/store';
import { useRegistrering } from '@app/hooks/use-registrering';
import { DocumentViewerContext, type ViewedVedlegg } from '@app/pages/registrering/document-viewer-context';
import { useSetArkivertDokumentTitleMutation } from '@app/redux/api/journalposter';
import type { IArkivertDocument } from '@app/types/dokument';
import { ArrowUndoIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import { useCallback, useContext, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  exitEditMode: () => void;
  dokument: IArkivertDocument | ViewedVedlegg;
}

export const EditTitle = ({ exitEditMode, dokument }: Props) => {
  const { tittel, dokumentInfoId, journalpostId } = dokument;
  const { viewDokument } = useContext(DocumentViewerContext);
  const { sakenGjelderValue } = useRegistrering();
  const [setJournalpostTitle] = useSetArkivertDokumentTitleMutation();

  const [newTitle, setNewTitle] = useState(tittel ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const onSaveClick = useCallback(async () => {
    setIsLoading(true);

    try {
      await setJournalpostTitle({ sakenGjelderValue, journalpostId, dokumentInfoId, tittel: newTitle });

      toast.success('Dokumenttittel endret');

      viewDokument(dokument);
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`Feil ved endring av dokumenttittel: ${e.message}`);
      }
    }

    setIsLoading(false);
    exitEditMode();
  }, [
    setJournalpostTitle,
    sakenGjelderValue,
    journalpostId,
    dokumentInfoId,
    newTitle,
    viewDokument,
    dokument,
    exitEditMode,
  ]);

  const isChanged = tittel !== newTitle;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isChanged) {
          onSaveClick();
        } else {
          exitEditMode();
        }
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
          data-color="neutral"
          variant="tertiary"
          size="xsmall"
          icon={<CheckmarkIcon title="Lagre" />}
          onClick={(e) => {
            e.stopPropagation();

            if (isChanged) {
              onSaveClick();
            } else {
              exitEditMode();
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          loading={isLoading}
        />
        <Button
          data-color="neutral"
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
