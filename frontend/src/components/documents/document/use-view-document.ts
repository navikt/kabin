import { compareDocuments } from '@app/domain/document';
import { DocumentViewerContext, type ViewedVedlegg } from '@app/pages/registrering/document-viewer-context';
import { KABIN_API_BASE_PATH } from '@app/redux/api/common';
import type { IArkivertDocument, VariantFormat } from '@app/types/dokument';
import { useCallback, useContext } from 'react';

export const useViewDocument = (
  documentToView: IArkivertDocument | ViewedVedlegg,
  format?: VariantFormat,
): [(e: React.MouseEvent) => void, boolean] => {
  const { dokumentInfoId, journalpostId, harTilgangTilArkivvariant } = documentToView;
  const { viewDokument, dokument: viewedDocument } = useContext(DocumentViewerContext);

  const isViewed = viewedDocument !== null && compareDocuments(viewedDocument, { dokumentInfoId, journalpostId });

  const view = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (e.ctrlKey || e.metaKey || e.button === 1) {
        const params: Record<string, string> = format === undefined ? {} : { format };
        return window.open(getDocumentUrl(journalpostId, dokumentInfoId, params), '_blank', 'noopener noreferrer');
      }

      if (e.button !== 0) {
        return;
      }

      if (harTilgangTilArkivvariant && !isViewed) {
        viewDokument(documentToView);
      }
    },
    [viewDokument, documentToView, dokumentInfoId, journalpostId, harTilgangTilArkivvariant, isViewed, format],
  );

  return [view, isViewed];
};

export const getDocumentUrl = (
  journalpostId: string,
  dokumentInfoId: string,
  params: Record<string, string>,
): string => {
  const queryParams = new URLSearchParams(params);
  queryParams.append('version', Date.now().toString());

  return `${KABIN_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf?${queryParams.toString()}`;
};
