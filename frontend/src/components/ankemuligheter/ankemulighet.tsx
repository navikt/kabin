import { Button, Table } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { isoDateTimeToPrettyDate } from '../../domain/date';
import { getSakspartName } from '../../domain/name';
import { useUtfallName, useYtelseName } from '../../hooks/kodeverk';
import { AnkeContext } from '../../pages/create/anke-context';
import { IBehandling } from '../../types/behandling';
import { CheckmarkCircleFillIconColored } from '../colored-icons/colored-icons';

interface Props {
  ankemulighet: IBehandling;
}

export const Ankemulighet = ({ ankemulighet }: Props) => {
  const { ankemulighet: selectedAnkemulighet, setAnkemulighet, setKlager } = useContext(AnkeContext);
  const utfallName = useUtfallName(ankemulighet.utfallId);
  const ytelseName = useYtelseName(ankemulighet.ytelseId);

  const isSelected = selectedAnkemulighet?.behandlingId === ankemulighet.behandlingId;

  const icon = isSelected ? <CheckmarkCircleFillIconColored /> : undefined;
  const buttonText = isSelected ? '' : 'Velg';

  const selectAnke = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setAnkemulighet(ankemulighet);
      setKlager(ankemulighet.klager);
    },
    [ankemulighet, setAnkemulighet, setKlager]
  );

  return (
    <StyledTableRow selected={isSelected} onClick={selectAnke}>
      <Table.DataCell>{ytelseName}</Table.DataCell>
      <Table.DataCell>{isoDateTimeToPrettyDate(ankemulighet.vedtakDate) ?? ''}</Table.DataCell>
      <Table.DataCell>{getSakspartName(ankemulighet.sakenGjelder)}</Table.DataCell>
      <Table.DataCell>{getSakspartName(ankemulighet.klager)}</Table.DataCell>
      <Table.DataCell>{utfallName}</Table.DataCell>
      <Table.DataCell>{getSakspartName(ankemulighet.fullmektig)}</Table.DataCell>
      <Table.DataCell>{ankemulighet.sakFagsakId}</Table.DataCell>
      <Table.DataCell>{ankemulighet.sakFagsystem}</Table.DataCell>
      <StyledButtonCell>
        <Button size="small" variant="tertiary" icon={icon} onClick={selectAnke} data-testid="select-ankemulighet">
          {buttonText}
        </Button>
      </StyledButtonCell>
    </StyledTableRow>
  );
};

const StyledButtonCell = styled(Table.DataCell)`
  text-align: center;
`;

const StyledTableRow = styled(Table.Row)`
  cursor: pointer;
`;
