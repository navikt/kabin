import { TypeName } from '@app/components/muligheter/anke/type-name';
import { UsedCount } from '@app/components/muligheter/anke/used-count';
import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { YtelseTag } from '@app/components/ytelse-tag/ytelse-tag';
import { isoDateToPretty } from '@app/domain/date';
import { isDateAfter } from '@app/functions/date';
import { useFagsystemName, useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetAnkemulighetMutation } from '@app/redux/api/registreringer/mutations';
import type { IAnkemulighet, IOmgjøringskravmulighet } from '@app/types/mulighet';
import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

interface Props {
  mulighet: IAnkemulighet | IOmgjøringskravmulighet;
}

export const Mulighet = ({ mulighet }: Props) => {
  const { id, mulighet: selectedMulighet } = useRegistrering();
  const { journalpost } = useJournalpost();
  const [setMulighet, { isLoading }] = useSetAnkemulighetMutation();
  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const fagsystemName = useFagsystemName(mulighet.originalFagsystemId);
  const canEdit = useCanEdit();

  const isSelected = selectedMulighet?.id === mulighet.id;

  const isValid = useMemo(() => {
    if (journalpost === undefined) {
      return false;
    }

    if (mulighet.vedtakDate === null) {
      return true;
    }

    return !isDateAfter(mulighet.vedtakDate, journalpost.datoOpprettet);
  }, [journalpost, mulighet.vedtakDate]);

  const selectMulighet = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isValid) {
        return;
      }

      if (selectedMulighet === null || selectedMulighet?.id !== mulighet.id) {
        setMulighet({ id, mulighet: mulighet });
      }
    },
    [isValid, selectedMulighet, mulighet, setMulighet, id],
  );

  const usedCount = mulighet.sourceOfExistingAnkebehandling.length;

  return (
    <StyledTableRow
      selected={isSelected}
      onClick={selectMulighet}
      $isValid={isValid}
      $isSelected={isSelected}
      $clickable={canEdit}
    >
      <Table.DataCell>
        <TypeName typeId={mulighet.typeId} />
      </Table.DataCell>
      <Table.DataCell>{mulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>
        <Tag variant="alt3" size="small">
          {temaName}
        </Tag>
      </Table.DataCell>
      <Table.DataCell>
        <YtelseTag ytelseId={mulighet.ytelseId} />
      </Table.DataCell>
      <Table.DataCell>{isoDateToPretty(mulighet.vedtakDate) ?? 'Ukjent'}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <Table.DataCell>
        <UsedCount usedCount={usedCount} />
      </Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet isSelected={isSelected} select={selectMulighet} isValid={isValid} isLoading={isLoading} />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
