import { useParams } from '@app/components/gosys-oppgaver/hooks';
import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetGosysOppgaverQuery } from '@app/redux/api/oppgaver';
import { SaksTypeEnum } from '@app/types/common';
import { FAGSYSTEM_PESYS } from '@app/types/fagsystem';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

const useSuggestedEnhet = (): string | null => {
  const {
    typeId,
    mulighetIsBasedOnJournalpost,
    overstyringer: { gosysOppgaveId },
  } = useRegistrering();
  const { data: journalpost } = useJournalpostFromMulighet();
  const gosysParams = useParams();
  const { data: gosysOppgaver = [] } = useGetGosysOppgaverQuery(gosysOppgaveId === null ? skipToken : gosysParams);

  if (
    typeId !== SaksTypeEnum.KLAGE ||
    !mulighetIsBasedOnJournalpost ||
    journalpost?.sak?.fagsystemId !== FAGSYSTEM_PESYS
  ) {
    return null;
  }

  return gosysOppgaver.find((oppgave) => oppgave.id === gosysOppgaveId)?.opprettetAvEnhetsnr ?? null;
};

interface Props {
  setEnhet: (enhet: string) => void;
  selectedEnhet: string | null;
}

export const SuggestedEnhet = ({ setEnhet, selectedEnhet }: Props) => {
  const suggestedEnhet = useSuggestedEnhet();

  if (suggestedEnhet === null || suggestedEnhet === selectedEnhet) {
    return null;
  }

  return (
    <Button onClick={() => setEnhet(suggestedEnhet)} size="small" variant="secondary" className="whitespace-nowrap">
      Bruk foreslått enhet ({suggestedEnhet})
    </Button>
  );
};
