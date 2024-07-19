import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { isDateAfter } from '@app/functions/date';
import { useFagsystemName, useFullTemaNameFromId, useYtelseName } from '@app/hooks/kodeverk';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { IAnkeMulighet, TypeId } from '@app/types/mulighet';

interface Props {
  mulighet: IAnkeMulighet;
}

export const Ankemulighet = ({ mulighet }: Props) => {
  const { type, updateState, state, journalpost } = useContext(AppContext);

  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const ytelseName = useYtelseName(mulighet.ytelseId);
  const fagsystemName = useFagsystemName(mulighet.fagsystemId);

  const typeName = useMemo(() => {
    switch (mulighet.typeId) {
      case TypeId.KLAGE:
        return (
          <NowrapTag variant="info-filled" size="small">
            Klage
          </NowrapTag>
        );
      case TypeId.ANKE:
        return (
          <NowrapTag variant="alt1-filled" size="small">
            Anke
          </NowrapTag>
        );
      case TypeId.ANKE_I_TR:
        return (
          <NowrapTag variant="alt3-filled" size="small">
            Anke i TR
          </NowrapTag>
        );
    }
  }, [mulighet.typeId]);

  const isSelected = type === Type.ANKE && state.mulighet?.id === mulighet.id;

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

      if (type === Type.ANKE && state.mulighet !== mulighet) {
        updateState({ mulighet });
      }
    },
    [isValid, mulighet, state?.mulighet, type, updateState],
  );

  const usedCount = mulighet.sourceOfExistingAnkebehandling.length;

  return (
    <StyledTableRow selected={isSelected} onClick={selectAnke} $isValid={isValid} $isSelected={isSelected}>
      <Table.DataCell>{typeName}</Table.DataCell>
      <Table.DataCell>{mulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>{temaName}</Table.DataCell>
      <Table.DataCell>{ytelseName}</Table.DataCell>
      <Table.DataCell>{isoDateToPretty(mulighet.vedtakDate) ?? 'Ukjent'}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <Table.DataCell>
        {usedCount === 0 ? null : (
          <NowrapTag variant="warning" size="small">
            Brukt til {usedCount} anke{usedCount > 1 ? 'r' : ''}
          </NowrapTag>
        )}
      </Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet isSelected={isSelected} select={selectAnke} isValid={isValid} />
      </StyledButtonCell>
    </StyledTableRow>
  );
};

const NowrapTag = styled(Tag)`
  white-space: nowrap;
`;
