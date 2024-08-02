import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { styled } from 'styled-components';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { isDateAfter } from '@app/functions/date';
import { useFagsystemName, useFullTemaNameFromId, useYtelseName } from '@app/hooks/kodeverk';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetAnkemulighetMutation } from '@app/redux/api/registreringer/mutations';
import { MulighetId } from '@app/redux/api/registreringer/types';
import { SaksTypeEnum } from '@app/types/common';
import { IAnkemulighet } from '@app/types/mulighet';

interface Props {
  ankemulighet: IAnkemulighet;
}

export const Ankemulighet = ({ ankemulighet }: Props) => {
  const { id, mulighet } = useRegistrering();
  const { journalpost } = useJournalpost();
  const [setAnkemulighet, { isLoading }] = useSetAnkemulighetMutation();
  const temaName = useFullTemaNameFromId(ankemulighet.temaId);
  const ytelseName = useYtelseName(ankemulighet.ytelseId);
  const fagsystemName = useFagsystemName(ankemulighet.fagsystemId);
  const canEdit = useCanEdit();

  const typeName = useMemo(() => {
    switch (ankemulighet.typeId) {
      case SaksTypeEnum.KLAGE:
        return (
          <NowrapTag variant="info-filled" size="small">
            Klage
          </NowrapTag>
        );
      case SaksTypeEnum.ANKE:
        return (
          <NowrapTag variant="alt1-filled" size="small">
            Anke
          </NowrapTag>
        );
    }
  }, [ankemulighet.typeId]);

  const isSelected = mulighet?.id === ankemulighet.id;

  const isValid = useMemo(() => {
    if (journalpost === undefined) {
      return false;
    }

    if (ankemulighet.vedtakDate === null) {
      return true;
    }

    return !isDateAfter(ankemulighet.vedtakDate, journalpost.datoOpprettet);
  }, [journalpost, ankemulighet.vedtakDate]);

  const selectAnke = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isValid) {
        return;
      }

      if (mulighet === null || !isSameMulighet(mulighet, ankemulighet)) {
        setAnkemulighet({ id, mulighet: ankemulighet });
      }
    },
    [isValid, mulighet, ankemulighet, setAnkemulighet, id],
  );

  mulighet?.fagsystemId;

  const usedCount = ankemulighet.sourceOfExistingAnkebehandling.length;

  return (
    <StyledTableRow
      selected={isSelected}
      onClick={selectAnke}
      $isValid={isValid}
      $isSelected={isSelected}
      $clickable={canEdit}
    >
      <Table.DataCell>{typeName}</Table.DataCell>
      <Table.DataCell>{ankemulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>{temaName}</Table.DataCell>
      <Table.DataCell>{ytelseName}</Table.DataCell>
      <Table.DataCell>{isoDateToPretty(ankemulighet.vedtakDate) ?? 'Ukjent'}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <Table.DataCell>
        {usedCount === 0 ? null : (
          <NowrapTag variant="warning" size="small">
            Brukt til {usedCount} anke{usedCount > 1 ? 'r' : ''}
          </NowrapTag>
        )}
      </Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet isSelected={isSelected} select={selectAnke} isValid={isValid} isLoading={isLoading} />
      </StyledButtonCell>
    </StyledTableRow>
  );
};

const isSameMulighet = (a: MulighetId, b: MulighetId) => a.id === b.id && a.fagsystemId === b.fagsystemId;

const NowrapTag = styled(Tag)`
  white-space: nowrap;
`;
