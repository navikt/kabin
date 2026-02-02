import { ReadOnlyTag } from '@app/components/documents/document/logiske-vedlegg/shared/vedlegg-style';
import type { LogiskVedlegg } from '@app/types/dokument';

interface Props {
  logiskVedlegg: LogiskVedlegg;
}

export const ReadOnlyLogiskVedlegg = ({ logiskVedlegg }: Props) => (
  <ReadOnlyTag size="small" variant="neutral" title={logiskVedlegg.tittel}>
    <span className="cursor-text truncate opacity-100">{logiskVedlegg.tittel}</span>
  </ReadOnlyTag>
);
