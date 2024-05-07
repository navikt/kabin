import React from 'react';
import { styled } from 'styled-components';
import { ReadOnlyTag } from '@app/components/documents/document/logiske-vedlegg/shared/vedlegg-style';
import { LogiskVedlegg } from '@app/types/dokument';

interface Props {
  logiskVedlegg: LogiskVedlegg;
}

export const ReadOnlyLogiskVedlegg = ({ logiskVedlegg }: Props) => (
  <ReadOnlyTag size="small" variant="neutral">
    <Title>{logiskVedlegg.tittel}</Title>
  </ReadOnlyTag>
);

const Title = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 1;
  cursor: text;
`;
