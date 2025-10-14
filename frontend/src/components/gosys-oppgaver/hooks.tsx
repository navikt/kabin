import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useTemaId } from '@app/hooks/use-tema-id';
import { useGetFagsystemerQuery } from '@app/redux/api/kodeverk';
import type { IGetGosysOppgaverParams } from '@app/redux/api/oppgaver';
import { skipToken } from '@reduxjs/toolkit/query/react';

export const useParams = (): IGetGosysOppgaverParams | typeof skipToken => {
  const { sakenGjelderValue } = useRegistrering();
  const temaId = useTemaId();

  if (sakenGjelderValue === null) {
    return skipToken;
  }

  return { identifikator: sakenGjelderValue, temaId: temaId ?? undefined };
};

const useFagsystemId = (): string | null => {
  const { mulighetIsBasedOnJournalpost } = useRegistrering();
  const { mulighet } = useMulighet();

  const { journalpost } = useJournalpostFromMulighet();

  if (mulighetIsBasedOnJournalpost) {
    return journalpost?.sak?.fagsystemId ?? null;
  }

  return mulighet?.originalFagsystemId ?? null;
};

export const useIsEnabled = () => {
  const { mulighetIsBasedOnJournalpost } = useRegistrering();
  const { data: fagsystemer = [] } = useGetFagsystemerQuery();
  const fagsystemId = useFagsystemId();
  const { mulighet } = useRegistrering();

  if (mulighetIsBasedOnJournalpost && typeof mulighet?.id === 'string') {
    return true;
  }

  const fagsystem = fagsystemer.find(({ id }) => id === fagsystemId);

  if (fagsystem === undefined) {
    return false;
  }

  return !fagsystem.modernized;
};
