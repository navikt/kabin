import React from 'react';
import { EditLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/edit';
import { useAddLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/use-logiske-vedlegg';
import { LogiskVedlegg } from '@app/types/dokument';

interface Props {
  dokumentInfoId: string;
  logiskeVedlegg: LogiskVedlegg[];
  onClose: () => void;
  temaId: string | null;
}

export const CreateLogiskVedlegg = ({ dokumentInfoId, logiskeVedlegg, onClose, temaId }: Props) => {
  const [add, { isLoading }] = useAddLogiskVedlegg(dokumentInfoId);

  return (
    <EditLogiskVedlegg
      onClose={onClose}
      onDone={add}
      logiskeVedlegg={logiskeVedlegg}
      isLoading={isLoading}
      placeholder="Legg til"
      temaId={temaId}
    />
  );
};
