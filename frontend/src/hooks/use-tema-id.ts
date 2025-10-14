import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';

export const useTemaId = (): string | null => {
  const { mulighetIsBasedOnJournalpost } = useRegistrering();
  const { mulighet } = useMulighet();
  const { journalpost } = useJournalpostFromMulighet();

  if (mulighetIsBasedOnJournalpost) {
    return journalpost === undefined ? null : journalpost.temaId;
  }

  return mulighet?.temaId ?? null;
};
