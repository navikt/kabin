import { ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Loader, Table } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { Card } from '@app/components/card/card';
import {
  CardHeader,
  StyledButton,
  StyledTableHeader,
  TableContainer,
} from '@app/components/muligheter/common/styled-components';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedKlagemulighet } from '@app/components/selected/selected-klagemulighet';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useKlagemuligheter } from '@app/simple-api-state/use-api';
import { IKlagemulighet } from '@app/types/mulighet';
import { Warning } from '../common/warning';
import { Klagemulighet } from './klagemulighet';

export const Klagemuligheter = () => {
  const { type, payload, updatePayload, fnr, journalpost } = useContext(ApiContext);

  const { data: klagemuligheter, isLoading } = useKlagemuligheter(fnr);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (typeof klagemuligheter === 'undefined' && type === Type.KLAGE) {
      setIsExpanded(true);

      if (payload.mulighet !== null) {
        updatePayload({ mulighet: null });
      }
    }
  }, [klagemuligheter, isLoading, type, updatePayload, payload?.mulighet]);

  if (type !== Type.KLAGE) {
    return null;
  }

  if (!isExpanded && payload.mulighet !== null) {
    return <SelectedKlagemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <Card>
      <CardHeader>
        <Heading level="1" size="small">
          Velg vedtaket klagen gjelder
        </Heading>

        {payload.mulighet === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            title="Vis kun valgt klagemulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </CardHeader>

      <Warning mottattDate={journalpost?.datoOpprettet} vedtakDate={payload.mulighet?.vedtakDate} />

      <Content klagemuligheter={klagemuligheter} isLoading={isLoading} />
    </Card>
  );
};

interface ContentProps {
  klagemuligheter: IKlagemulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ klagemuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <Placeholder>
        <Loader size="3xlarge" title="Laster..." />
      </Placeholder>
    );
  }

  if (klagemuligheter === undefined) {
    return (
      <Placeholder>
        <ParagraphIcon aria-hidden />
      </Placeholder>
    );
  }

  if (klagemuligheter.length === 0) {
    return <BodyShort>Ingen klagemuligheter</BodyShort>;
  }

  return (
    <TableContainer $showShadow={klagemuligheter.length >= 3}>
      <Table zebraStripes size="small">
        <StyledTableHeader>
          <Table.Row>
            <Table.HeaderCell>Saks-ID</Table.HeaderCell>
            <Table.HeaderCell>Tema</Table.HeaderCell>
            <Table.HeaderCell>Vedtaksdato</Table.HeaderCell>
            <Table.HeaderCell>Utfall</Table.HeaderCell>
            <Table.HeaderCell>Behandlende enhet</Table.HeaderCell>
            <Table.HeaderCell>Fagsak-ID</Table.HeaderCell>
            <Table.HeaderCell>Fagsystem</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </StyledTableHeader>
        <Table.Body>
          {klagemuligheter.map((klagemulighet) => (
            <Klagemulighet key={klagemulighet.sakId} mulighet={klagemulighet} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};
