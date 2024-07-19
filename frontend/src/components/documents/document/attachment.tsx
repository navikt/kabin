import { styled } from 'styled-components';
import { EditableLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logiske-vedlegg-list';
import { ReadOnlyLogiskeVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logiske-vedlegg-list';
import { IArkivertDocument, IVedlegg } from '@app/types/dokument';
import { DocumentTitle } from './document-title';
import { useViewDocument } from './use-view-document';
import { ViewDocumentButton } from './view-document-button';

interface Props {
  dokument: IArkivertDocument;
  vedlegg: IVedlegg;
}

export const Attachment = ({ vedlegg, dokument }: Props) => {
  const { journalpostId, harTilgangTilArkivvariant, temaId } = dokument;
  const { dokumentInfoId, tittel, logiskeVedlegg } = vedlegg;
  const [viewDokument, isViewed] = useViewDocument({
    dokumentInfoId,
    journalpostId,
    tittel,
    harTilgangTilArkivvariant,
  });

  return (
    <StyledAttachmentListItem
      onMouseDown={viewDokument}
      data-testid="document-vedlegg-list-item"
      data-documentname={tittel}
      $isViewed={isViewed}
    >
      <DocumentTitle
        journalpostId={journalpostId}
        dokumentInfoId={dokumentInfoId}
        tittel={tittel ?? 'Ukjent dokumentnavn'}
      />
      {harTilgangTilArkivvariant ? (
        <EditableLogiskeVedlegg logiskeVedlegg={logiskeVedlegg} dokumentInfoId={dokumentInfoId} temaId={temaId} />
      ) : (
        <ReadOnlyLogiskeVedlegg logiskeVedlegg={logiskeVedlegg} />
      )}
      <ViewDocumentButton
        dokumentInfoId={dokumentInfoId}
        journalpostId={journalpostId}
        harTilgangTilArkivvariant={harTilgangTilArkivvariant}
        tittel={tittel}
      />
    </StyledAttachmentListItem>
  );
};

const StyledAttachmentListItem = styled.li<{ $isViewed: boolean }>`
  display: grid;
  position: relative;
  padding-left: 36px;
  grid-template-columns: max-content 1fr 30px 55px;
  grid-template-areas: 'title logiske-vedlegg view select';
  column-gap: 8px;
  background-color: ${({ $isViewed }) => ($isViewed ? 'var(--a-orange-100)' : 'transparent')};

  &:hover {
    background-color: ${({ $isViewed }) => ($isViewed ? 'var(--a-orange-200)' : 'transparent')};
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    border-bottom: 1px solid #c6c2bf;
    width: 18px;
    left: 0;
    top: 15px;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    border-left: 1px solid #c6c2bf;
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
