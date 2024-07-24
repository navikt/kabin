import { Button, Table, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { StyledButtonCell } from '@app/components/muligheter/common/styled-components';
import { Beskrivelse } from '@app/components/oppgaver/beskrivelse';
import { isoDateTimeToPrettyDate, isoDateToPretty } from '@app/domain/date';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { useTema } from '@app/simple-api-state/use-kodeverk';
import { IOppgave } from '@app/types/oppgave';

export const Row = ({
  id,
  opprettetTidspunkt,
  fristFerdigstillelse,
  temaId,
  gjelder,
  oppgavetype,
  opprettetAvEnhetsnr,
  tildeltEnhetsnr,
  beskrivelse,
}: IOppgave) => {
  const { type, state, updateState } = useContext(AppContext);
  const { data: tema = [] } = useTema();

  if (type === Type.NONE) {
    return null;
  }

  const temaName = tema.find((t) => t.id === temaId)?.beskrivelse ?? temaId;
  const selected = state.overstyringer.oppgaveId === id;

  return (
    <StyledRow
      content={<Beskrivelse beskrivelse={beskrivelse} />}
      selected={selected}
      onClick={() => updateState({ overstyringer: { oppgaveId: selected ? null : id } })}
    >
      <Table.DataCell>
        {opprettetTidspunkt === null ? null : isoDateTimeToPrettyDate(opprettetTidspunkt)}
      </Table.DataCell>
      <Table.DataCell>{isoDateToPretty(fristFerdigstillelse)}</Table.DataCell>
      <Table.DataCell>{temaName}</Table.DataCell>
      <Table.DataCell>{gjelder}</Table.DataCell>
      <Table.DataCell>{oppgavetype}</Table.DataCell>
      <Table.DataCell>{tildeltEnhetsnr}</Table.DataCell>
      <Table.DataCell>{opprettetAvEnhetsnr}</Table.DataCell>

      <StyledButtonCell>
        <Tooltip content={selected ? 'Oppgave er valgt. Klikk for å fjerne valg.' : 'Velg oppgave'}>
          <Button
            size="small"
            variant="tertiary"
            onClick={() => updateState({ overstyringer: { oppgaveId: selected ? null : id } })}
            icon={selected ? <CheckmarkCircleFillIconColored aria-hidden /> : null}
          >
            {selected ? null : 'Velg'}
          </Button>
        </Tooltip>
      </StyledButtonCell>
    </StyledRow>
  );
};

const StyledRow = styled(Table.ExpandableRow)`
  height: 44px;
  cursor: pointer;
`;
