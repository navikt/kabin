import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';

export const useTemaId = (): string | null => {
  const { mulighet, fromJournalpost } = useMulighet();
  const { journalpost } = useJournalpostFromMulighet();

  if (fromJournalpost) {
    return journalpost === undefined ? null : journalpost.temaId;
  }

  return mulighet?.temaId ?? null;
};
