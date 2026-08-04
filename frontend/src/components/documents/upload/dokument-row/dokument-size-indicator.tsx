import { formatFileSize } from '@app/domain/file-size';
import {
  DOKUMENT_FAILED_STATUSES,
  DokumentStatus,
  type RegistreringDokument,
} from '@app/redux/api/registreringer/types';
import { Tag } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface Props {
  dokument: RegistreringDokument;
}

/**
 * The document's size. Always occupies the same fixed-width column regardless of document status.
 */
export const DokumentSizeIndicator = ({ dokument }: Props) => {
  const muted = dokument.status !== DokumentStatus.DONE && !DOKUMENT_FAILED_STATUSES.includes(dokument.status);

  return <SizeTag muted={muted}>{formatFileSize(dokument.size)}</SizeTag>;
};

interface SizeTagProps {
  muted?: boolean;
  children: ReactNode;
}

const SizeTag = ({ muted = false, children }: SizeTagProps) => (
  <Tag
    size="small"
    variant="outline"
    data-color="neutral"
    className={muted ? 'whitespace-nowrap opacity-60' : 'whitespace-nowrap'}
  >
    {children}
  </Tag>
);
