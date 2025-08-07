import { useParams } from '@app/components/gosys-oppgaver/hooks';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetGosysOppgaverQuery } from '@app/redux/api/oppgaver';
import { useSetOppgaveIdMutation } from '@app/redux/api/overstyringer/overstyringer';
import { SaksTypeEnum } from '@app/types/common';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Heading, HelpText } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { styled } from 'styled-components';

export const Header = () => {
  const { id, typeId, overstyringer } = useRegistrering();
  const [setOppgaveId] = useSetOppgaveIdMutation();
  const oppgaverParams = useParams();
  const { refetch, isLoading } = useGetGosysOppgaverQuery(oppgaverParams);

  if (oppgaverParams === skipToken) {
    return null;
  }

  const onRefresh = async () => {
    const { data: oppgaver } = await refetch();

    if (oppgaver === undefined || oppgaver.some((o) => o.id === overstyringer.gosysOppgaveId)) {
      return;
    }

    // If selected oppgaveId is not in the list of oppgaver, reset oppgaveId.
    setOppgaveId({ id, gosysOppgaveId: null });
  };

  return (
    <StyledHeading level="2" size="small">
      Velg oppgave i Gosys
      <OppgaveHelpText typeId={typeId} />
      <Button
        size="xsmall"
        variant="tertiary-neutral"
        onClick={onRefresh}
        loading={isLoading}
        title="Oppdater"
        icon={<ArrowsCirclepathIcon aria-hidden />}
      />
    </StyledHeading>
  );
};

const OppgaveHelpText = ({ typeId }: { typeId: SaksTypeEnum | null }) => {
  if (typeId === SaksTypeEnum.KLAGE) {
    return (
      <HelpText>
        Du må velge oppgave i Gosys. Dersom klagesaken ikke har en oppgave i Gosys, må du opprette en. Kabal bruker
        denne oppgaven til å gi beskjed til vedtaksinstans når klagebehandling er fullført.
      </HelpText>
    );
  }

  if (typeId === SaksTypeEnum.ANKE) {
    return (
      <HelpText>
        Du må velge oppgave i Gosys. Dersom ankesaken ikke har en oppgave i Gosys, må du opprette en. Kabal bruker denne
        oppgaven til å gi beskjed til vedtaksinstans når ankebehandling er fullført.
      </HelpText>
    );
  }

  return null;
};

const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: 4px;
`;
