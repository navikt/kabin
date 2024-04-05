import { Table } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId, useVedtaksenhetName } from '@app/hooks/kodeverk';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { IKlagemulighet } from '@app/types/mulighet';

interface Props {
  mulighet: IKlagemulighet;
}

export const Klagemulighet = ({ mulighet }: Props) => {
  const { type, updateState, state } = useContext(AppContext);

  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const vedtaksenhetName = useVedtaksenhetName(mulighet.klageBehandlendeEnhet);
  const fagsystemName = useFagsystemName(mulighet.fagsystemId);

  const isSelected = type === Type.KLAGE && state.mulighet?.id === mulighet.id;

  const selectKlage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (type === Type.KLAGE && state.mulighet !== mulighet) {
        updateState({ mulighet });
      }
    },
    [mulighet, state?.mulighet, type, updateState],
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
