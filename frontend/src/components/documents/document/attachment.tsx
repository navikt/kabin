import { DocumentTitle } from '@app/components/documents/document/document-title';
import { canOpen } from '@app/components/documents/document/filetype';
import { EditableLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logiske-vedlegg-list';
import { ReadOnlyLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logiske-vedlegg-list';
import { useViewDocument } from '@app/components/documents/document/use-view-document';
import { ViewDocumentButton } from '@app/components/documents/document/view-document-button';
import type { IArkivertDocument, IVedlegg } from '@app/types/dokument';
import { styled } from 'styled-components';

interface Props {
  dokument: IArkivertDocument;
  vedlegg: IVedlegg;
}

export const Attachment = ({ vedlegg, dokument }: Props) => {
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
    <StyledAttachmentListItem
      onMouseDown={onMouseDown}
      data-testid="document-vedlegg-list-item"
      data-documentname={tittel}
      $isViewed={isViewed}
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
    </StyledAttachmentListItem>
  );
};

const StyledAttachmentListItem = styled.li<{ $isViewed: boolean }>`
  display: grid;
  position: relative;
  padding-left: 48px;
  grid-template-columns: max-content 1fr 30px 55px 20px;
  grid-template-areas: 'title logiske-vedlegg view select already-used';
  column-gap: 8px;
  background-color: ${({ $isViewed }) => ($isViewed ? 'var(--ax-warning-200)' : 'transparent')};

  &:hover {
    background-color: ${({ $isViewed }) => ($isViewed ? 'var(--ax-warning-300)' : 'transparent')};
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    border-bottom: 1px solid var(--ax-border-neutral-subtle);
    width: 40px;
    left: 0;
    top: 15px;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    border-left: 1px solid var(--ax-border-neutral-subtle);
    width: 1px;
    left: 0;
    top: 0;
  }

  &:not(:last-of-type) {
    &::after {
      height: 100%;
    }
  }

  &:last-of-type {
    &::after {
      height: 16px;
    }
  }
`;
