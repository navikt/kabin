import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { TypeName } from '@app/components/muligheter/common/type-name';
import { UsedCount } from '@app/components/muligheter/common/used-count';
import { YtelseTag } from '@app/components/ytelse-tag/ytelse-tag';
import { isoDateToPretty } from '@app/domain/date';
import { isDateAfter } from '@app/functions/date';
import { useFagsystemName, useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetOmgjøringskravmulighetMutation } from '@app/redux/api/registreringer/mutations';
import type { IOmgjøringskravmulighet } from '@app/types/mulighet';
import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

interface Props {
  omgjøringskravmulighet: IOmgjøringskravmulighet;
}

export const Omgjøringskravmulighet = ({ omgjøringskravmulighet }: Props) => {
  const { id, mulighet } = useRegistrering();
  const { journalpost } = useJournalpost();
  const [setOmgjøringskravmulighet, { isLoading }] = useSetOmgjøringskravmulighetMutation();
  const temaName = useFullTemaNameFromId(omgjøringskravmulighet.temaId);
  const fagsystemName = useFagsystemName(omgjøringskravmulighet.originalFagsystemId);
  const canEdit = useCanEdit();

  const isSelected = mulighet?.id === omgjøringskravmulighet.id;

  const isValid = useMemo(() => {
    if (journalpost === undefined) {
      return false;
    }

    if (omgjøringskravmulighet.vedtakDate === null) {
      return true;
    }

    return !isDateAfter(omgjøringskravmulighet.vedtakDate, journalpost.datoOpprettet);
  }, [journalpost, omgjøringskravmulighet.vedtakDate]);

  const selectOmgjøringskrav = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isValid) {
        return;
      }

      if (mulighet === null || mulighet?.id !== omgjøringskravmulighet.id) {
        setOmgjøringskravmulighet({ id, mulighet: omgjøringskravmulighet });
      }
    },
    [isValid, mulighet, omgjøringskravmulighet, setOmgjøringskravmulighet, id],
  );

  const usedCount = omgjøringskravmulighet.sourceOfExistingBehandlinger.length;

  return (
    <StyledTableRow
      selected={isSelected}
      onClick={selectOmgjøringskrav}
      $isValid={isValid}
      $isSelected={isSelected}
      $clickable={canEdit}
    >
      <Table.DataCell>
        <TypeName typeId={omgjøringskravmulighet.typeId} />
      </Table.DataCell>
      <Table.DataCell>{omgjøringskravmulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>
        <Tag variant="alt3" size="small">
          {temaName}
        </Tag>
      </Table.DataCell>
      <Table.DataCell>
        <YtelseTag ytelseId={omgjøringskravmulighet.ytelseId} />
      </Table.DataCell>
      <Table.DataCell>{isoDateToPretty(omgjøringskravmulighet.vedtakDate) ?? 'Ukjent'}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <Table.DataCell>
        <UsedCount usedCount={usedCount} />
      </Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet
          isSelected={isSelected}
          select={selectOmgjøringskrav}
          isValid={isValid}
          isLoading={isLoading}
          mulighetId={omgjøringskravmulighet.id}
        />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
