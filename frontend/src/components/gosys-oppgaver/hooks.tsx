import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useTemaId } from '@app/hooks/use-tema-id';
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

export const useIsEnabled = () => {
  const { mulighetIsBasedOnJournalpost } = useRegistrering();
  const { mulighet } = useMulighet();

  if (mulighetIsBasedOnJournalpost && typeof mulighet?.id === 'string') {
    return true;
  }

  return mulighet?.requiresGosysOppgave === true;
};
