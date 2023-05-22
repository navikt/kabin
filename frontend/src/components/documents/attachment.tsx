import React from 'react';
import styled from 'styled-components';
import { IArkivertDocument, IVedlegg } from '@app/types/dokument';
import { DocumentTitle } from './document-title';
import { useViewDocument } from './use-view-document';
import { ViewDocumentButton } from './view-document-button';

interface Props {
  dokument: IArkivertDocument;
  vedlegg: IVedlegg;
}

export const Attachment = ({ vedlegg, dokument }: Props) => {
  const { journalpostId, harTilgangTilArkivvariant } = dokument;
  const { dokumentInfoId, tittel } = vedlegg;
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
      data-documentname={vedlegg.tittel}
      $isViewed={isViewed}
    >
      <DocumentTitle
        journalpostId={journalpostId}
        dokumentInfoId={dokumentInfoId}
        tittel={tittel ?? 'Ukjent dokumentnavn'}
      />
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
  grid-template-columns: 1fr 30px 55px;
  grid-template-areas: 'title view select';
  gap: 8px;
  background-color: ${({ $isViewed }) => ($isViewed ? 'var(--a-orange-100)' : 'transparent')};

  :hover {
    background-color: ${({ $isViewed }) => ($isViewed ? 'var(--a-orange-200)' : 'transparent')};
  }

  &::before {
    content: '';
    display: block;
    width: 18px;
    position: absolute;
    left: 0;
    top: 50%;
    border-bottom: 1px solid #c6c2bf;
  }
`;
