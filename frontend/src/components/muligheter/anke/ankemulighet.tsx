import { Table } from '@navikt/ds-react';
import React, { useCallback, useContext, useMemo } from 'react';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { getSakspartName } from '@app/domain/name';
import { isDateAfter } from '@app/functions/date';
import { useFagsystemName, useFullTemaNameFromId, useUtfallName, useYtelseName } from '@app/hooks/kodeverk';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IAnkeMulighet } from '@app/types/mulighet';

interface Props {
  mulighet: IAnkeMulighet;
}

export const Ankemulighet = ({ mulighet }: Props) => {
  const { type, updatePayload, payload, journalpost } = useContext(ApiContext);

  const utfallName = useUtfallName(mulighet.utfallId);
  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const ytelseName = useYtelseName(mulighet.ytelseId);
  const fagsystemName = useFagsystemName(mulighet.fagsystemId);

  const isSelected = type === Type.ANKE && payload.mulighet?.id === mulighet.id;

  const isValid = useMemo(() => {
    if (journalpost === null) {
      return false;
    }

    if (mulighet.vedtakDate === null) {
      return true;
    }

    return !isDateAfter(mulighet.vedtakDate, journalpost.datoOpprettet);
  }, [journalpost, mulighet.vedtakDate]);

  const selectAnke = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isValid) {
        return;
      }

      if (type === Type.ANKE && payload.mulighet !== mulighet) {
        updatePayload({ mulighet });
      }
    },
    [isValid, mulighet, payload?.mulighet, type, updatePayload],
  );

  return (
    <StyledTableRow selected={isSelected} onClick={selectAnke} $isValid={isValid} $isSelected={isSelected}>
      <Table.DataCell>{temaName}</Table.DataCell>
      <Table.DataCell>{ytelseName}</Table.DataCell>
      <Table.DataCell>{isoDateToPretty(mulighet.vedtakDate) ?? 'Ukjent'}</Table.DataCell>
      <Table.DataCell>{getSakspartName(mulighet.sakenGjelder)}</Table.DataCell>
      <Table.DataCell>{getSakspartName(mulighet.klager)}</Table.DataCell>
      <Table.DataCell>{utfallName}</Table.DataCell>
      <Table.DataCell>{getSakspartName(mulighet.fullmektig)}</Table.DataCell>
      <Table.DataCell>{mulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet isSelected={isSelected} select={selectAnke} isValid={isValid} />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
