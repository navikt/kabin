import { Table } from '@navikt/ds-react';
import { useCallback } from 'react';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId, useVedtaksenhetName } from '@app/hooks/kodeverk';
import { useAppStateStore } from '@app/pages/create/app-context/state';
import { IKlagemulighet } from '@app/types/mulighet';

interface Props {
  mulighet: IKlagemulighet;
}

export const Klagemulighet = ({ mulighet }: Props) => {
  const selectedMulighet = useAppStateStore((s) => s.mulighet);
  const setSelectedMulighet = useAppStateStore((s) => s.setMulighet);

  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const vedtaksenhetName = useVedtaksenhetName(mulighet.klageBehandlendeEnhet);
  const fagsystemName = useFagsystemName(mulighet.fagsystemId);

  const isSelected = selectedMulighet?.id === mulighet.id;

  const selectKlage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (selectedMulighet !== mulighet) {
        setSelectedMulighet(mulighet);
      }
    },
    [mulighet, selectedMulighet, setSelectedMulighet],
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
        <SelectMulighet isSelected={isSelected} select={selectKlage} isValid />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
