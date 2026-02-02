import { DocumentTitle } from '@app/components/documents/document/document-title';
import { canOpen } from '@app/components/documents/document/filetype';
import { EditableLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logiske-vedlegg-list';
import { ReadOnlyLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logiske-vedlegg-list';
import { useViewDocument } from '@app/components/documents/document/use-view-document';
import { ViewDocumentButton } from '@app/components/documents/document/view-document-button';
import type { IArkivertDocument, IVedlegg } from '@app/types/dokument';

interface Props {
  dokument: IArkivertDocument;
  vedlegg: IVedlegg;
  isLast?: boolean;
}

export const Attachment = ({ vedlegg, dokument, isLast = false }: Props) => {
  const { journalpostId, harTilgangTilArkivvariant, temaId } = dokument;
  const { dokumentInfoId, tittel, logiskeVedlegg, varianter } = vedlegg;

  const [viewDokument, isViewed] = useViewDocument({ ...vedlegg, journalpostId });

  const isDownload = !canOpen(varianter);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!harTilgangTilArkivvariant) {
      return;
    }

    if (!isDownload) {
      return viewDokument(e);
    }

    window.location.href = `/api/kabin-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;
  };

  return (
    <li
      onMouseDown={onMouseDown}
      data-testid="document-vedlegg-list-item"
      data-documentname={tittel}
      className={`relative grid gap-x-2 pl-12 ${isViewed ? 'bg-ax-warning-200 hover:bg-ax-warning-300' : 'bg-transparent hover:bg-transparent'}before:content-[''] before:absolute before:top-3.75 before:left-0 before:block before:w-10 before:border-ax-border-neutral-subtle before:border-b after:absolute after:top-0 after:left-0 after:block after:w-px after:border-ax-border-neutral-subtle after:border-l after:content-[''] ${isLast ? 'after:h-4' : 'after:h-full'}
      `}
      style={{
        gridTemplateColumns: 'max-content 1fr 30px 55px 20px',
        gridTemplateAreas: "'title logiske-vedlegg view select already-used'",
      }}
    >
      <DocumentTitle dokument={{ ...vedlegg, journalpostId }} />
      {harTilgangTilArkivvariant ? (
        <EditableLogiskeVedlegg logiskeVedlegg={logiskeVedlegg} dokumentInfoId={dokumentInfoId} temaId={temaId} />
      ) : (
        <ReadOnlyLogiskeVedlegg logiskeVedlegg={logiskeVedlegg} />
      )}
      <ViewDocumentButton
        viewDocument={onMouseDown}
        isViewed={isViewed}
        harTilgangTilArkivvariant={harTilgangTilArkivvariant}
        isDownload={isDownload}
      />
    </li>
  );
};
