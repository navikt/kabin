import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useBasemulighetProp } from '@app/hooks/use-mulighet-prop';

export const useTemaId = (): string | null => {
  const { fromJournalpost } = useMulighet();
  const temaId = useBasemulighetProp('temaId');
  const { journalpost } = useJournalpostFromMulighet();

  if (fromJournalpost) {
    return journalpost === undefined ? null : journalpost.temaId;
  }

  return temaId;
};
