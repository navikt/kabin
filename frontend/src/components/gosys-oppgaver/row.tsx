import {
  CheckmarkCircleFillIconColored,
  ExclamationmarkTriangleFillIconColored,
} from '@app/components/colored-icons/colored-icons';
import { StyledButtonCell } from '@app/components/muligheter/common/styled-components';
import { isoDateTimeToPrettyDate, isoDateToPretty } from '@app/domain/date';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetTemaQuery } from '@app/redux/api/kodeverk';
import { useSetOppgaveIdMutation } from '@app/redux/api/overstyringer/overstyringer';
import type { IGosysOppgave } from '@app/types/gosys-oppgave';
import { BodyLong, Button, Heading, Table, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';

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
  alreadyUsed,
}: IGosysOppgave) => {
  const { id: registreringId, typeId, overstyringer } = useRegistrering();
  const [setOppgaveId] = useSetOppgaveIdMutation();
  const { data: tema = [] } = useGetTemaQuery();

  if (typeId === null) {
    return null;
  }

  const temaName = tema.find((t) => t.id === temaId)?.beskrivelse ?? temaId;
  const selected = overstyringer.gosysOppgaveId === id;

  const onClick = alreadyUsed
    ? undefined
    : () => setOppgaveId({ id: registreringId, gosysOppgaveId: selected ? null : id });

  return (
    <StyledRow
      content={<Beskrivelse beskrivelse={beskrivelse} />}
      selected={selected}
      onClick={onClick}
      $alreadyUsed={alreadyUsed}
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
        <SelectButton selected={selected} alreadyUsed={alreadyUsed} onClick={onClick} />
      </StyledButtonCell>
    </StyledRow>
  );
};

interface SelectButtonProps {
  selected: boolean;
  alreadyUsed: boolean;
  onClick: (() => void) | undefined;
}

const SelectButton = ({ selected, alreadyUsed, onClick }: SelectButtonProps) => {
  if (alreadyUsed) {
    return (
      <Tooltip content="Oppgaven er tilknyttet en annen behandling.">
        <span>
          <ExclamationmarkTriangleFillIconColored aria-hidden />
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={selected ? 'Oppgave er valgt. Klikk for å fjerne valg.' : 'Velg oppgave'}>
      <Button
        size="small"
        variant="tertiary"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        icon={selected ? <CheckmarkCircleFillIconColored aria-hidden /> : null}
        title={selected ? 'Valgt' : undefined}
      >
        {selected ? null : 'Velg'}
      </Button>
    </Tooltip>
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
  border-left: 4px solid var(--ax-border-neutral-subtle);
  padding-left: 1rem;
`;

const StyledBeskrivelse = styled.section`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

const StyledRow = styled(Table.ExpandableRow)<{ $alreadyUsed: boolean }>`
  height: 44px;
  cursor: ${({ $alreadyUsed }) => ($alreadyUsed ? 'auto' : 'pointer')};
`;
