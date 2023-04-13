import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { IArkivertDocument, IVedlegg } from '@app/types/dokument';
import { DocumentTitle } from './document-title';

interface Props {
  dokument: IArkivertDocument;
  vedlegg: IVedlegg;
}

export const Attachment = ({ vedlegg, dokument }: Props) => {
  const { setJournalpost } = useContext(ApiContext);
  const { journalpostId } = dokument;
  const { dokumentInfoId, tittel = 'Ukjent dokumentnavn' } = vedlegg;

  const selectVedlegg = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (dokument.harTilgangTilArkivvariant && !dokument.alreadyUsed) {
        setJournalpost(dokument);

        return;
      }

      setJournalpost(null);
    },
    [dokument, setJournalpost]
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
