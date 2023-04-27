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
import { SelectedAnkemulighet } from '@app/components/selected/selected-ankemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useAnkemuligheter } from '@app/simple-api-state/use-api';
import { IAnkeMulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { Warning } from '../common/warning';
import { Ankemulighet } from './ankemulighet';

export const Ankemuligheter = () => {
  const { type, payload, updatePayload, fnr, journalpost } = useContext(ApiContext);

  const { data: ankemuligheter, isLoading } = useAnkemuligheter(fnr);
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  useEffect(() => {
    if (typeof ankemuligheter === 'undefined' && type === Type.ANKE && payload.mulighet !== null) {
      setIsExpanded(true);
      updatePayload({ mulighet: null });
    }
  }, [ankemuligheter, isLoading, payload?.mulighet, type, updatePayload]);

  if (type !== Type.ANKE) {
    return null;
  }

  if (!isExpanded && payload.mulighet !== null) {
    return <SelectedAnkemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <Card>
      <CardHeader>
        <Heading level="1" size="small">
          Velg vedtaket anken gjelder
        </Heading>

        {payload.mulighet === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            title="Vis kun valgt ankemulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </CardHeader>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning mottattDate={journalpost?.registrert} vedtakDate={payload.mulighet?.vedtakDate} />

      <Content ankemuligheter={ankemuligheter} isLoading={isLoading} />
    </Card>
  );
};

interface ContentProps {
  ankemuligheter: IAnkeMulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ ankemuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <Placeholder>
        <Loader size="3xlarge" title="Laster..." />
      </Placeholder>
    );
  }

  if (ankemuligheter === undefined) {
    return (
      <Placeholder>
        <ParagraphIcon aria-hidden />
      </Placeholder>
    );
  }

  if (ankemuligheter.length === 0) {
    return <BodyShort>Ingen ankemuligheter</BodyShort>;
  }

  return (
    <TableContainer $showShadow={ankemuligheter.length >= 3}>
      <Table zebraStripes size="small">
        <StyledTableHeader>
          <Table.Row>
            <Table.HeaderCell>Ytelse</Table.HeaderCell>
            <Table.HeaderCell>Vedtaksdato</Table.HeaderCell>
            <Table.HeaderCell>Saken gjelder</Table.HeaderCell>
            <Table.HeaderCell>Klager</Table.HeaderCell>
            <Table.HeaderCell>Utfall</Table.HeaderCell>
            <Table.HeaderCell>Fullmektig</Table.HeaderCell>
            <Table.HeaderCell>Fagsak-ID</Table.HeaderCell>
            <Table.HeaderCell>Fagsystem</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </StyledTableHeader>
        <Table.Body>
          {ankemuligheter.map((ankemulighet) => (
            <Ankemulighet key={ankemulighet.behandlingId} mulighet={ankemulighet} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};
