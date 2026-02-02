import {
  CheckmarkCircleFillIconColored,
  ExclamationmarkTriangleFillIconColored,
} from '@app/components/colored-icons/colored-icons';
import { StyledButtonCell } from '@app/components/muligheter/common/table-components';
import { isoDateTimeToPrettyDate, isoDateToPretty } from '@app/domain/date';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetTemaQuery } from '@app/redux/api/kodeverk';
import { useSetOppgaveIdMutation } from '@app/redux/api/overstyringer/overstyringer';
import type { IGosysOppgave } from '@app/types/gosys-oppgave';
import { BodyLong, Box, Button, Heading, Table, Tooltip, VStack } from '@navikt/ds-react';

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
    <Table.ExpandableRow
      content={<Beskrivelse beskrivelse={beskrivelse} />}
      selected={selected}
      onClick={onClick}
      className={`h-11 ${alreadyUsed ? 'cursor-auto' : 'cursor-pointer'}`}
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
    </Table.ExpandableRow>
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
        data-color="neutral"
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
  <VStack as="section" gap="space-16">
    <Heading size="small" level="1">
      Beskrivelse
    </Heading>
    <Box asChild borderColor="neutral-subtle" borderWidth="0 0 0 4" paddingInline="space-16 space-0">
      <BodyLong className="whitespace-pre">{beskrivelse ?? 'Ingen beskrivelse tilgjengelig.'}</BodyLong>
    </Box>
  </VStack>
);
