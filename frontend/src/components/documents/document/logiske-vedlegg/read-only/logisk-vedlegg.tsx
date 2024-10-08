import { ReadOnlyTag } from '@app/components/documents/document/logiske-vedlegg/shared/vedlegg-style';
import type { LogiskVedlegg } from '@app/types/dokument';
import { styled } from 'styled-components';

interface Props {
  logiskVedlegg: LogiskVedlegg;
}

export const ReadOnlyLogiskVedlegg = ({ logiskVedlegg }: Props) => (
  <ReadOnlyTag size="small" variant="neutral" title={logiskVedlegg.tittel}>
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
