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
import type { IAnkemulighet } from '@app/types/mulighet';
import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

interface Props {
  ankemulighet: IAnkemulighet;
}

export const Ankemulighet = ({ ankemulighet }: Props) => {
  const { id, mulighet } = useRegistrering();
  const { journalpost } = useJournalpost();
  const [setAnkemulighet, { isLoading }] = useSetAnkemulighetMutation();
  const temaName = useFullTemaNameFromId(ankemulighet.temaId);
  const fagsystemName = useFagsystemName(ankemulighet.originalFagsystemId);
  const canEdit = useCanEdit();

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

      if (mulighet === null || mulighet?.id !== ankemulighet.id) {
        setAnkemulighet({ id, mulighet: ankemulighet });
      }
    },
    [isValid, mulighet, ankemulighet, setAnkemulighet, id],
  );

  const usedCount = ankemulighet.sourceOfExistingAnkebehandling.length;

  return (
    <StyledTableRow
      selected={isSelected}
      onClick={selectAnke}
      $isValid={isValid}
      $isSelected={isSelected}
      $clickable={canEdit}
    >
      <Table.DataCell>
        <TypeName typeId={ankemulighet.typeId} />
      </Table.DataCell>
      <Table.DataCell>{ankemulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>
        <Tag variant="alt3" size="small">
          {temaName}
        </Tag>
      </Table.DataCell>
      <Table.DataCell>
        <YtelseTag ytelseId={ankemulighet.ytelseId} />
      </Table.DataCell>
      <Table.DataCell>{isoDateToPretty(ankemulighet.vedtakDate) ?? 'Ukjent'}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <Table.DataCell>
        <UsedCount usedCount={usedCount} />
      </Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet isSelected={isSelected} select={selectAnke} isValid={isValid} isLoading={isLoading} />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
