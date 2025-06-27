import { compareDocuments } from '@app/domain/document';
import { DocumentViewerContext } from '@app/pages/registrering/document-viewer-context';
import { KABIN_API_BASE_PATH } from '@app/redux/api/common';
import { useCallback, useContext } from 'react';

interface Props {
  tittel: string | null;
  dokumentInfoId: string;
  journalpostId: string;
  harTilgangTilArkivvariant: boolean;
}

export const useViewDocument = ({
  journalpostId,
  dokumentInfoId,
  tittel,
  harTilgangTilArkivvariant,
}: Props): [(e: React.MouseEvent) => void, boolean] => {
  const { viewDokument, dokument: viewedDocument } = useContext(DocumentViewerContext);

  const isViewed = viewedDocument !== null && compareDocuments(viewedDocument, { dokumentInfoId, journalpostId });

  const view = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (e.ctrlKey || e.metaKey || e.button === 1) {
        return window.open(getDocumentUrl(journalpostId, dokumentInfoId), '_blank', 'noopener noreferrer');
      }

      if (e.button !== 0) {
        return;
      }

      if (harTilgangTilArkivvariant && !isViewed) {
        viewDokument({ dokumentInfoId, journalpostId, tittel: tittel ?? 'Ukjent dokumentnavn' });
      }
    },
    [harTilgangTilArkivvariant, isViewed, viewDokument, dokumentInfoId, journalpostId, tittel],
  );

  return [view, isViewed];
};

export const getDocumentUrl = (journalpostId: string, dokumentInfoId: string): string =>
  `${KABIN_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;
