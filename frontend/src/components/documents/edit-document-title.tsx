import { ArrowUndoIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import React, { useCallback, useContext, useState } from 'react';
import { editTitle } from '@app/api/api';
import { isApiError } from '@app/components/footer/error-type-guard';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';
import { useDokumenter } from '@app/simple-api-state/use-api';

interface Props {
  exitEditMode: () => void;
  dokumentInfoId: string;
  journalpostId: string;
  title: string;
}

export const EditTitle = ({ exitEditMode, dokumentInfoId, journalpostId, title }: Props) => {
  const { viewDokument } = useContext(DocumentViewerContext);
  const { fnr, setJournalpost } = useContext(AppContext);

  const { updateData: updateDokumenter } = useDokumenter(fnr);

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

        viewDokument({ tittel: newTitle, journalpostId, dokumentInfoId });

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
                          v.dokumentInfoId === dokumentInfoId ? { ...v, tittel: newTitle } : v,
                        ),
                      }
                    : doc,
                ),
              },
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
    exitEditMode();
  }, [exitEditMode, newTitle, journalpostId, dokumentInfoId, viewDokument, updateDokumenter, setJournalpost]);

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
      <TextField
        value={newTitle}
        onChange={({ target }) => setNewTitle(target.value)}
        label="Endre tittel"
        size="small"
        hideLabel
        autoFocus
        onKeyDown={onKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
      />
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
    </>
  );
};
