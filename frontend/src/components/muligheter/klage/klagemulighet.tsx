import { Table } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId, useVedtaksenhetName } from '@app/hooks/kodeverk';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IKlagemulighet } from '@app/types/mulighet';

interface Props {
  mulighet: IKlagemulighet;
}

export const Klagemulighet = ({ mulighet }: Props) => {
  const { type, updatePayload, payload } = useContext(ApiContext);

  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const vedtaksenhetName = useVedtaksenhetName(mulighet.klageBehandlendeEnhet);
  const fagsystemName = useFagsystemName(mulighet.fagsystemId);

  const isSelected = type === Type.KLAGE && payload.mulighet?.behandlingId === mulighet.behandlingId;

  const selectKlage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (type === Type.KLAGE && payload.mulighet !== mulighet) {
        updatePayload({ mulighet });
      }
    },
    [mulighet, payload?.mulighet, type, updatePayload],
  );

  return (
    <StyledTableRow selected={isSelected} onClick={selectKlage} $isValid $isSelected={isSelected}>
      <Table.DataCell>{mulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>{mulighet.behandlingId}</Table.DataCell>
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
