import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Heading, HelpText } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { useGetOppgaver } from '@app/simple-api-state/use-api';
import { oppgaverIsEnabled, useParams } from './hooks';

export const Header = () => {
  const { fnr, type, state, updateState } = useContext(AppContext);
  const { isLoading, refetch } = useGetOppgaver(useParams(type, fnr, state));

  if (type === Type.NONE || !oppgaverIsEnabled(type, state)) {
    return null;
  }

  const onRefresh = async () => {
    const data = await refetch();

    if (data === undefined || data.find(({ id }) => id === state.overstyringer.oppgaveId) === undefined) {
      updateState({ overstyringer: { oppgaveId: null } });
    }
  };

  return (
    <StyledHeading level="2" size="small">
      Velg oppgave i Gosys
      <OppgaveHelpText type={type} />
      <Button
        size="xsmall"
        variant="tertiary"
        onClick={onRefresh}
        loading={isLoading}
        title="Oppdater"
        icon={<ArrowsCirclepathIcon aria-hidden />}
      />
    </StyledHeading>
  );
};

const OppgaveHelpText = ({ type }: { type: Type }) => {
  if (type === Type.KLAGE) {
    return (
      <HelpText>
        Du må velge oppgave i Gosys. Dersom klagesaken ikke har en oppgave i Gosys, må du opprette en. Kabal bruker
        denne oppgaven til å gi beskjed til vedtaksinstans når klagebehandling er fullført.
      </HelpText>
    );
  }

  if (type === Type.ANKE) {
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
