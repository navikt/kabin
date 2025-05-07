import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { SaksTypeEnum } from '@app/types/common';

export const useTemaId = (): string | null => {
  const { typeId, mulighetIsBasedOnJournalpost } = useRegistrering();
  const { mulighet } = useMulighet();
  const { journalpost } = useJournalpostFromMulighet();

  const isOmgjøringskravBasedOnJournalpost = typeId === SaksTypeEnum.OMGJØRINGSKRAV && mulighetIsBasedOnJournalpost;

  if (isOmgjøringskravBasedOnJournalpost) {
    return journalpost === undefined ? null : journalpost.temaId;
  }

  return mulighet?.temaId ?? null;
};
