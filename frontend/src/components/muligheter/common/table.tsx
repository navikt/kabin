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
import type { SetAnkemulighetParams, SetNonAnkemulighetParams } from '@app/redux/api/registreringer/param-types';
import type { IAnkemulighet, IBegjæringOmGjenopptakMulighet, IOmgjøringskravmulighet } from '@app/types/mulighet';
import type { ValidationFieldNames } from '@app/types/validation';
import { Table, Tag } from '@navikt/ds-react';
import { type ReactNode, useCallback, useMemo } from 'react';

type Mulighet = IAnkemulighet | IOmgjøringskravmulighet | IBegjæringOmGjenopptakMulighet;

interface Props extends CommonProps {
  label: string;
  headers: ReactNode;
  muligheter: Mulighet[];
  fieldName: ValidationFieldNames;
}

interface CommonProps {
  setMulighetHook: () =>
    | readonly [(p: SetNonAnkemulighetParams | SetAnkemulighetParams) => void, { isLoading: boolean }]
    | readonly [(p: SetAnkemulighetParams) => void, { isLoading: boolean }];
}

export const MulighetTable = ({ label, headers, muligheter, fieldName, setMulighetHook }: Props) => (
  <div className="overflow-y-auto">
    <Table zebraStripes size="small" id={fieldName} aria-label={label}>
      {headers}
      <Table.Body>
        {muligheter.map((mulighet) => (
          <Row key={mulighet.id} mulighet={mulighet} setMulighetHook={setMulighetHook} />
        ))}
      </Table.Body>
    </Table>
  </div>
);

interface RowProps extends CommonProps {
  mulighet: Mulighet;
}

const Row = ({ mulighet, setMulighetHook }: RowProps) => {
  const { id, mulighet: registreringMulighet } = useRegistrering();
  const { journalpost } = useJournalpost();
  const [setMulighet, { isLoading }] = setMulighetHook();
  const temaName = useFullTemaNameFromId(mulighet.temaId);
  const fagsystemName = useFagsystemName(mulighet.originalFagsystemId);
  const canEdit = useCanEdit();

  const isSelected = registreringMulighet?.id === mulighet.id;

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

      if (registreringMulighet === null || registreringMulighet?.id !== mulighet.id) {
        setMulighet({ id, mulighet });
      }
    },
    [isValid, registreringMulighet, mulighet, id, setMulighet],
  );

  const usedCount = mulighet.sourceOfExistingBehandlinger.length;

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
        <Tag data-color="info" variant="outline" size="small">
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
        <SelectMulighet
          isSelected={isSelected}
          select={selectMulighet}
          isValid={isValid}
          isLoading={isLoading}
          mulighetId={mulighet.id}
        />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
