import { ArrowUndoIcon, CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { editTitle } from '@app/api/api';
import { isApiError } from '@app/components/footer/error-type-guard';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { DocumentViewerContext, IViewedDocument } from '@app/pages/create/document-viewer-context';
import { useDokumenter } from '@app/simple-api-state/use-api';

interface Props {
  show: boolean;
  toggleEditMode: () => void;
}

export const EditTitle = ({ show, toggleEditMode }: Props) => {
  const { dokument } = useContext(DocumentViewerContext);

  if (!show || dokument === null) {
    return null;
  }

  return <EditLoadedTitle toggleEditMode={toggleEditMode} dokument={dokument} />;
};

interface EditLoadedTitleProps {
  toggleEditMode: () => void;
  dokument: IViewedDocument;
}

const EditLoadedTitle = ({ toggleEditMode, dokument }: EditLoadedTitleProps) => {
  const { viewDokument } = useContext(DocumentViewerContext);
  const { fnr, setJournalpost } = useContext(ApiContext);

  const { updateData: updateDokumenter } = useDokumenter(fnr);

  const { tittel: title, dokumentInfoId, journalpostId } = dokument;

  const [newTitle, setNewTitle] = useState(title ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const onSaveClick = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await editTitle(newTitle, journalpostId, dokumentInfoId);

      if (res.ok) {
        toast({ type: ToastType.SUCCESS, message: `Dokumenttittel endret` });

        setJournalpost((journalpost) => {
          if (journalpost === null) {
            return null;
          }

          return { ...journalpost, tittel: newTitle };
        });

        viewDokument({ ...dokument, tittel: newTitle });

        updateDokumenter((data) =>
          data === undefined
            ? undefined
            : {
                ...data,
                dokumenter: data.dokumenter.map((doc) =>
                  doc.journalpostId === journalpostId
                    ? {
                        ...doc,
                        tittel: doc.dokumentInfoId === dokumentInfoId ? newTitle : doc.tittel,
                        vedlegg: doc.vedlegg.map((v) =>
                          v.dokumentInfoId === dokumentInfoId ? { ...v, tittel: newTitle } : v
                        ),
                      }
                    : doc
                ),
              }
        );
      } else {
        const json = (await res.json()) as unknown;

        if (isApiError(json)) {
          errorToast(json);
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        toast({ type: ToastType.ERROR, message: `Feil ved endring av dokumenttittel: ${e.message}` });
      }
    }

    setIsLoading(false);
    toggleEditMode();
  }, [
    toggleEditMode,
    newTitle,
    journalpostId,
    dokumentInfoId,
    viewDokument,
    dokument,
    updateDokumenter,
    setJournalpost,
  ]);

  const isChanged = title !== newTitle;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        isChanged ? onSaveClick() : toggleEditMode();
      }

      if (e.key === 'Escape') {
        toggleEditMode();
      }
    },
    [isChanged, onSaveClick, toggleEditMode]
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
      />
      <Button
        variant="tertiary"
        size="small"
        icon={<CheckmarkCircleIcon title="Lagre" />}
        onClick={isChanged ? onSaveClick : toggleEditMode}
        loading={isLoading}
      />
      <Button variant="tertiary" size="small" icon={<ArrowUndoIcon title="Avbryt" />} onClick={toggleEditMode} />
    </>
  );
};

const StyledTextField = styled(TextField)`
  width: 100%;
  flex-grow: 1;
`;
