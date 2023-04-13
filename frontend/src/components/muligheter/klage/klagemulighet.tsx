import { Table } from '@navikt/ds-react';
import React, { useCallback, useContext, useMemo } from 'react';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { isDateAfter } from '@app/functions/date';
import { useFagsystemName, useFullTemaNameFromId, useUtfallName, useVedtaksenhetName } from '@app/hooks/kodeverk';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IKlagemulighet } from '@app/types/klagemulighet';

interface Props {
  mulighet: IKlagemulighet;
}

export const Klagemulighet = ({ mulighet }: Props) => {
  const { type, updatePayload, payload, journalpost } = useContext(ApiContext);

  const utfallName = useUtfallName(mulighet.utfall);
  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const vedtaksenhetName = useVedtaksenhetName(mulighet.klageBehandlendeEnhet);
  const fagsystemName = useFagsystemName(mulighet.fagsystemId);

  const isInvalid = useMemo(
    () => journalpost === null || isDateAfter(mulighet.vedtakDate, journalpost.datoOpprettet),
    [journalpost, mulighet.vedtakDate]
  );

  const isSelected = type === Type.KLAGE && payload.mulighet?.sakId === mulighet.sakId;

  const selectKlage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isInvalid) {
        return;
      }

      if (type === Type.KLAGE && payload.mulighet !== mulighet) {
        updatePayload({ mulighet });
      }
    },
    [isInvalid, mulighet, payload?.mulighet, type, updatePayload]
  );

  return (
    <StyledTableRow selected={isSelected} onClick={selectKlage} $isInvalid={isInvalid} $isSelected={isSelected}>
      <Table.DataCell>{mulighet.sakId}</Table.DataCell>
      <Table.DataCell>{temaName}</Table.DataCell>
      <Table.DataCell>{isoDateToPretty(mulighet.vedtakDate) ?? ''}</Table.DataCell>
      <Table.DataCell>{utfallName}</Table.DataCell>
      <Table.DataCell>{vedtaksenhetName}</Table.DataCell>
      <Table.DataCell>{mulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet isSelected={isSelected} select={selectKlage} isInvalid={isInvalid} />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
