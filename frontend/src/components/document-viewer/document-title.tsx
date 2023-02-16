import { Cancel, Edit, SuccessStroke } from '@navikt/ds-icons';
import { Button, Heading, TextField } from '@navikt/ds-react';
import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { AnkeContext } from '../../pages/create/anke-context';
import { DocumentViewerContext } from '../../pages/create/document-viewer-context';
import { KABIN_API_BASE_PATH, useDokumenter } from '../../simple-api-state/use-api';
import { isApiError } from '../footer/error-type-guard';
import { errorToast } from '../toast/error-toast';
import { toast } from '../toast/store';
import { ToastType } from '../toast/types';

export const DocumentTitle = () => {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <StyledDocumentTitle>
      <ViewTitle show={!editMode} toggleEditMode={toggleEditMode} />
      <EditTitle show={editMode} toggleEditMode={toggleEditMode} />
    </StyledDocumentTitle>
  );
};

interface ViewTitleProps {
  show: boolean;
  toggleEditMode: () => void;
}

const ViewTitle = ({ show, toggleEditMode }: ViewTitleProps) => {
  const { dokument } = useContext(DocumentViewerContext);

  if (!show) {
    return null;
  }

  const { tittel: title } = dokument;

  return (
    <>
      <StyledHeading size="small" level="1">
        {title}
      </StyledHeading>
      <Button variant="tertiary" icon={<Edit title="Endre dokumenttittel" />} size="small" onClick={toggleEditMode} />
    </>
  );
};

interface EditTitleProps {
  show: boolean;
  toggleEditMode: () => void;
}

const EditTitle = ({ show, toggleEditMode }: EditTitleProps) => {
  const { dokument, viewDokument } = useContext(DocumentViewerContext);
  const { fnr } = useContext(AnkeContext);

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
  }, [toggleEditMode, newTitle, journalpostId, dokumentInfoId, viewDokument, dokument, updateDokumenter]);

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

  if (!show) {
    return null;
  }

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
        icon={<SuccessStroke title="Lagre" />}
        onClick={isChanged ? onSaveClick : toggleEditMode}
        loading={isLoading}
      />
      <Button variant="tertiary" size="small" icon={<Cancel title="Avbryt" />} onClick={toggleEditMode} />
    </>
  );
};

const StyledTextField = styled(TextField)`
  width: 100%;
  flex-grow: 1;
`;

const StyledHeading = styled(Heading)`
  width: 100%;
  flex-grow: 1;
`;

const StyledDocumentTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const editTitle = async (tittel: string, journalpostId: string, dokumentInfoId: string) =>
  fetch(`${KABIN_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/tittel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tittel }),
  });
