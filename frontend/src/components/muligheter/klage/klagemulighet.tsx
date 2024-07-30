import { Table } from '@navikt/ds-react';
import { useCallback } from 'react';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId, useVedtaksenhetName } from '@app/hooks/kodeverk';
import { Registrering, useSetMulighetMutation } from '@app/redux/api/registrering';
import { IKlagemulighet } from '@app/types/mulighet';

interface Props {
  registrering: Registrering;
  mulighet: IKlagemulighet;
}

export const Klagemulighet = ({ registrering, mulighet }: Props) => {
  const { id } = registrering;
  const selectedMulighetId = registrering.mulighet?.id;
  const [setSelectedMulighet, { isLoading }] = useSetMulighetMutation();

  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const vedtaksenhetName = useVedtaksenhetName(mulighet.klageBehandlendeEnhet);
  const fagsystemName = useFagsystemName(mulighet.fagsystemId);

  const isSelected = selectedMulighetId === mulighet.id;

  const selectKlage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isLoading && selectedMulighetId !== mulighet.id) {
        setSelectedMulighet({ id, mulighetId: mulighet.id, fagsystemId: mulighet.fagsystemId });
      }
    },
    [isLoading, mulighet, id, selectedMulighetId, setSelectedMulighet],
  );

  return (
    <StyledTableRow selected={isSelected} onClick={selectKlage} $isValid $isSelected={isSelected}>
      <Table.DataCell>{mulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>{mulighet.id}</Table.DataCell>
      <Table.DataCell>{temaName}</Table.DataCell>
      <Table.DataCell>{isoDateToPretty(mulighet.vedtakDate) ?? ''}</Table.DataCell>
      <Table.DataCell>{vedtaksenhetName}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet isSelected={isSelected} select={selectKlage} isValid isLoading={isLoading} />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
