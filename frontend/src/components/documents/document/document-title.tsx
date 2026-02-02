import { DocumentWarnings } from '@app/components/documents/document/document-warnings';
import { EditTitle } from '@app/components/documents/document/edit-document-title';
import { DocumentViewerContext, type ViewedVedlegg } from '@app/pages/registrering/document-viewer-context';
import type { IArkivertDocument } from '@app/types/dokument';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useState } from 'react';

interface Props {
  dokument: IArkivertDocument | ViewedVedlegg;
}

export const DocumentTitle = ({ dokument }: Props) => {
  const { dokumentInfoId, journalpostId, varianter } = dokument;
  const tittel = dokument.tittel ?? 'Ukjent dokumentnavn';
  const { dokument: viewed } = useContext(DocumentViewerContext);
  const [editMode, setEditMode] = useState(false);

  const isActive = useMemo(
    () => viewed !== null && viewed.dokumentInfoId === dokumentInfoId && viewed.journalpostId === journalpostId,
    [dokumentInfoId, journalpostId, viewed],
  );

  const enterEditMode = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditMode(true);
  }, []);

  if (!editMode) {
    return (
      <HStack align="center" gap="space-4" height="2rem" overflow="hidden" wrap={false}>
        <div
          title={tittel}
          data-testid="document-title"
          className={`select-text truncate ${isActive ? 'font-bold' : 'font-normal'}`}
        >
          {tittel}
        </div>
        <DocumentWarnings varianter={varianter} />
        <Button
          data-color="neutral"
          size="xsmall"
          variant="tertiary"
          icon={<PencilIcon aria-hidden />}
          title="Endre"
          onClick={enterEditMode}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </HStack>
    );
  }

  return (
    <HStack align="center" gap="space-4" height="2rem" overflow="hidden">
      <EditTitle exitEditMode={() => setEditMode(false)} dokument={{ ...dokument, journalpostId }} />
    </HStack>
  );
};
