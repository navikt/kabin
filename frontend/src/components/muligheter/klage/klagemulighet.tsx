import { SelectMulighet } from '@app/components/muligheter/common/select-button';
import { StyledButtonCell, StyledTableRow } from '@app/components/muligheter/common/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId, useVedtaksenhetName } from '@app/hooks/kodeverk';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetNonAnkemulighetMutation } from '@app/redux/api/registreringer/mutations';
import type { IKlagemulighet } from '@app/types/mulighet';
import { Table, Tag } from '@navikt/ds-react';
import { useCallback } from 'react';

interface Props {
  klagemulighet: IKlagemulighet;
}

export const Klagemulighet = ({ klagemulighet }: Props) => {
  const { id, mulighet } = useRegistrering();
  const [setKlagemulighet, { isLoading }] = useSetNonAnkemulighetMutation();
  const canEdit = useCanEdit();
  const temaName = useFullTemaNameFromId(klagemulighet.temaId);
  const vedtaksenhetName = useVedtaksenhetName(klagemulighet.klageBehandlendeEnhet);
  const fagsystemName = useFagsystemName(klagemulighet.originalFagsystemId);

  const isSelected = mulighet?.id === klagemulighet.id;

  const selectKlage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isLoading && mulighet?.id !== klagemulighet.id) {
        setKlagemulighet({ id, mulighet: klagemulighet });
      }
    },
    [isLoading, klagemulighet, id, mulighet, setKlagemulighet],
  );

  return (
    <StyledTableRow selected={isSelected} onClick={selectKlage} $isValid $isSelected={isSelected} $clickable={canEdit}>
      <Table.DataCell>{klagemulighet.fagsakId}</Table.DataCell>
      <Table.DataCell>
        <Tag data-color="info" variant="outline" size="small">
          {temaName}
        </Tag>
      </Table.DataCell>
      <Table.DataCell>{isoDateToPretty(klagemulighet.vedtakDate) ?? ''}</Table.DataCell>
      <Table.DataCell>{vedtaksenhetName}</Table.DataCell>
      <Table.DataCell>{fagsystemName}</Table.DataCell>
      <StyledButtonCell>
        <SelectMulighet
          isSelected={isSelected}
          select={selectKlage}
          isValid
          isLoading={isLoading}
          mulighetId={klagemulighet.id}
        />
      </StyledButtonCell>
    </StyledTableRow>
  );
};
