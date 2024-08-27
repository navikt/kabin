import { BodyLong, Button, Heading, Table, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { StyledButtonCell } from '@app/components/muligheter/common/styled-components';
import { isoDateTimeToPrettyDate, isoDateToPretty } from '@app/domain/date';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetTemaQuery } from '@app/redux/api/kodeverk';
import { useSetOppgaveIdMutation } from '@app/redux/api/overstyringer/overstyringer';
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
  const { id: registreringId, typeId, overstyringer } = useRegistrering();
  const [setOppgaveId] = useSetOppgaveIdMutation();
  const { data: tema = [] } = useGetTemaQuery();

  if (typeId === null) {
    return null;
  }

  const temaName = tema.find((t) => t.id === temaId)?.beskrivelse ?? temaId;
  const selected = overstyringer.oppgaveId === id;

  return (
    <StyledRow
      content={<Beskrivelse beskrivelse={beskrivelse} />}
      selected={selected}
      onClick={() => setOppgaveId({ id: registreringId, oppgaveId: selected ? null : id })}
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
            onClick={() => setOppgaveId({ id: registreringId, oppgaveId: selected ? null : id })}
            icon={selected ? <CheckmarkCircleFillIconColored aria-hidden /> : null}
            title={selected ? 'Valgt' : undefined}
          >
            {selected ? null : 'Velg'}
          </Button>
        </Tooltip>
      </StyledButtonCell>
    </StyledRow>
  );
};

const Beskrivelse = ({ beskrivelse }: { beskrivelse: string | null }) => (
  <StyledBeskrivelse>
    <Heading size="small" level="1">
      Beskrivelse
    </Heading>
    <StyledBodyLong>{beskrivelse ?? 'Ingen beskrivelse tilgjengelig.'}</StyledBodyLong>
  </StyledBeskrivelse>
);

const StyledBodyLong = styled(BodyLong)`
  white-space: pre;
  border-left: 4px solid var(--a-border-subtle);
  padding-left: 1rem;
`;

const StyledBeskrivelse = styled.section`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

const StyledRow = styled(Table.ExpandableRow)`
  height: 44px;
  cursor: pointer;
`;
