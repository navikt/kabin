import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { AnkeContext } from '../../pages/create/anke-context';
import { IArkivertDocument, IVedlegg } from '../../types/dokument';
import { DocumentTitle } from './document-title';

interface Props {
  dokument: IArkivertDocument;
  vedlegg: IVedlegg;
}

export const Attachment = ({ vedlegg, dokument }: Props) => {
  const { setDokument } = useContext(AnkeContext);
  const { journalpostId } = dokument;
  const { dokumentInfoId, tittel = 'Ukjent dokumentnavn' } = vedlegg;

  const selectVedlegg = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setDokument(dokument);
    },
    [dokument, setDokument]
  );

  return (
    <StyledAttachmentListItem
      onClick={selectVedlegg}
      data-testid="document-vedlegg-list-item"
      data-documentname={vedlegg.tittel}
    >
      <DocumentTitle
        journalpostId={journalpostId}
        dokumentInfoId={dokumentInfoId}
        tittel={tittel ?? ''}
        harTilgangTilArkivvariant={vedlegg.harTilgangTilArkivvariant}
      />
    </StyledAttachmentListItem>
  );
};

const StyledAttachmentListItem = styled.li`
  display: flex;
  position: relative;
  padding-left: 12px;

  &::before {
    content: '';
    display: block;
    width: 12px;
    position: absolute;
    left: 0;
    top: 50%;
    border-bottom: 1px solid #c6c2bf;
  }
`;
