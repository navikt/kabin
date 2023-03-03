import { Cancel, Edit, ExternalLink, SuccessColored } from '@navikt/ds-icons';
import { Button, Heading, TextField } from '@navikt/ds-react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { editTitle } from '../../api/api';
import { usePrevious } from '../../hooks/use-previous';
import { AnkeContext } from '../../pages/create/anke-context';
import { DocumentViewerContext, IViewedDocument } from '../../pages/create/document-viewer-context';
import { useDokumenter } from '../../simple-api-state/use-api';
import { isApiError } from '../footer/error-type-guard';
import { errorToast } from '../toast/error-toast';
import { toast } from '../toast/store';
import { ToastType } from '../toast/types';

interface Props {
  url: string;
}

export const DocumentTitle = ({ url }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const { dokument } = useContext(DocumentViewerContext);
  const previous = usePrevious(dokument);

  useEffect(() => {
    if (dokument !== previous) {
      setEditMode(false);
    }
  }, [dokument, previous]);

  if (dokument === null) {
    return null;
  }

  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <StyledDocumentTitle>
      <Button
        as="a"
        variant="tertiary"
        icon={<ExternalLink title="Åpne i nytt vindu" />}
        size="small"
        href={url}
        target="_blank"
        rel="noreferrer"
      />
      <ViewTitle show={!editMode} toggleEditMode={toggleEditMode} />
      <EditTitle show={editMode} toggleEditMode={toggleEditMode} />
    </StyledDocumentTitle>
  );
};

interface TitleProps {
  show: boolean;
  toggleEditMode: () => void;
}

const ViewTitle = ({ show, toggleEditMode }: TitleProps) => {
  const { dokument } = useContext(DocumentViewerContext);

  if (!show) {
    return null;
  }

  return (
    <>
      <StyledHeading size="small" level="1">
        {dokument?.tittel ?? ''}
      </StyledHeading>
      <Button variant="tertiary" icon={<Edit title="Endre dokumenttittel" />} size="small" onClick={toggleEditMode} />
    </>
  );
};

const EditTitle = ({ show, toggleEditMode }: TitleProps) => {
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
  const { fnr, setDokument, dokument: contextDokument } = useContext(AnkeContext);

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

        setDokument(contextDokument === null ? null : { ...contextDokument, tittel: newTitle });
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
    setDokument,
    contextDokument,
    viewDokument,
    dokument,
    updateDokumenter,
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
        icon={<SuccessColored title="Lagre" />}
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
