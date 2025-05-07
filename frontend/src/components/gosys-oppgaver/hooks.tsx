import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetFagsystemerQuery } from '@app/redux/api/kodeverk';
import type { IGetGosysOppgaverParams } from '@app/redux/api/oppgaver';
import { SaksTypeEnum } from '@app/types/common';
import { skipToken } from '@reduxjs/toolkit/query/react';

export const useParams = (): IGetGosysOppgaverParams | typeof skipToken => {
  const { sakenGjelderValue } = useRegistrering();

  if (sakenGjelderValue === null) {
    return skipToken;
  }

  return { identifikator: sakenGjelderValue };
};

const useFagsystemId = (): string | null => {
  const { typeId, mulighetIsBasedOnJournalpost } = useRegistrering();
  const { mulighet } = useMulighet();

  const { journalpost } = useJournalpostFromMulighet();

  const isOmgjøringskravBasedOnJournalpost = typeId === SaksTypeEnum.OMGJØRINGSKRAV && mulighetIsBasedOnJournalpost;

  if (isOmgjøringskravBasedOnJournalpost) {
    return journalpost?.sak?.fagsystemId ?? null;
  }

  return mulighet?.originalFagsystemId ?? null;
};

export const useIsEnabled = () => {
  const { mulighetIsBasedOnJournalpost, typeId } = useRegistrering();
  const { data: fagsystemer = [] } = useGetFagsystemerQuery();
  const fagsystemId = useFagsystemId();
  const { mulighet } = useRegistrering();

  if (typeId === SaksTypeEnum.OMGJØRINGSKRAV && mulighetIsBasedOnJournalpost && typeof mulighet?.id === 'string') {
    return true;
  }

  const fagsystem = fagsystemer.find(({ id }) => id === fagsystemId);

  if (fagsystem === undefined) {
    return false;
  }

  return !fagsystem.modernized;
};
