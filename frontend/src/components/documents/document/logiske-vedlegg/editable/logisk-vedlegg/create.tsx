import { EditLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useAddLogiskVedleggMutation } from '@app/redux/api/logiske-vedlegg';
import type { LogiskVedlegg } from '@app/types/dokument';

interface Props {
  dokumentInfoId: string;
  logiskeVedlegg: LogiskVedlegg[];
  onClose: () => void;
  temaId: string | null;
}

export const CreateLogiskVedlegg = ({ dokumentInfoId, logiskeVedlegg, onClose, temaId }: Props) => {
  const { sakenGjelderValue } = useRegistrering();
  const [add, { isLoading }] = useAddLogiskVedleggMutation({ fixedCacheKey: dokumentInfoId });

  if (sakenGjelderValue === null) {
    return null;
  }

  return (
    <EditLogiskVedlegg
      onClose={onClose}
      onDone={(tittel) => add({ sakenGjelderValue, dokumentInfoId, tittel })}
      logiskeVedlegg={logiskeVedlegg}
      isLoading={isLoading}
      placeholder="Legg til"
      temaId={temaId}
    />
  );
};
