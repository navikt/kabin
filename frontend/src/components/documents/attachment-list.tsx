import React from 'react';
import styled from 'styled-components';
import { IArkivertDocument } from '@app/types/dokument';
import { Attachment } from './attachment';

interface Props {
  dokument: IArkivertDocument;
}

export const AttachmentList = ({ dokument }: Props) => {
  if (dokument.vedlegg.length === 0) {
    return null;
  }

  return (
    <StyledAttachmentList data-testid="documents-vedlegg-list">
      {dokument.vedlegg.map((vedlegg) => (
        <Attachment
          key={`vedlegg_${dokument.journalpostId}_${vedlegg.dokumentInfoId}`}
          vedlegg={vedlegg}
          dokument={dokument}
        />
      ))}
    </StyledAttachmentList>
  );
};

const StyledAttachmentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding: 0;
  margin: 0;
  margin-left: 8px;
  list-style-type: none;

  &::before {
    content: '';
    display: block;
    width: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 17px;
    border-left: 1px solid #c6c2bf;
  }
`;
