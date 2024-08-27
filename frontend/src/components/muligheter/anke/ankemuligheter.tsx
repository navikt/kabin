import { ArrowsCirclepathIcon, ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Table } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { Card, CardSmall } from '@app/components/card/card';
import { Ankemulighet } from '@app/components/muligheter/anke/ankemulighet';
import { LoadingAnkeMuligheter } from '@app/components/muligheter/anke/loading-ankemuligheter';
import { TableHeaders } from '@app/components/muligheter/anke/table-headers';
import { TableContainer } from '@app/components/muligheter/common/styled-components';
import { Warning } from '@app/components/muligheter/common/warning';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedAnkemulighet, SelectedAnkemulighetBody } from '@app/components/selected/selected-ankemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useLazyGetMuligheterQuery } from '@app/redux/api/registreringer/queries';
import { SaksTypeEnum } from '@app/types/common';
import { IAnkemulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';

export const Ankemuligheter = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableAnkemuligheter />;
  }

  return <ReadOnlyAnkemulighet />;
};

const ReadOnlyAnkemulighet = () => {
  const { typeId, mulighet } = useMulighet();

  if (typeId !== SaksTypeEnum.ANKE || mulighet === undefined) {
    return null;
  }

  return (
    <Card>
      <Header>
        <Heading level="1" size="small">
          Vedtaket klagen gjelder
        </Heading>
      </Header>

      <SelectedAnkemulighetBody {...mulighet} />
    </Card>
  );
};

const EditableAnkemuligheter = () => {
  const { typeId, mulighet } = useMulighet();
  const { journalpost } = useJournalpost();
  const { ankemuligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.ANKE) {
    return null;
  }

  if (!isExpanded && mulighet !== undefined) {
    return <SelectedAnkemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardSmall>
      <Header>
        <Heading level="1" size="small">
          Velg vedtaket anken gjelder
        </Heading>

        <Button
          size="xsmall"
          variant="tertiary"
          onClick={() => refetch(id)}
          loading={isFetching}
          icon={<ArrowsCirclepathIcon aria-hidden />}
          title="Oppdater"
        />

        {mulighet === undefined ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            title="Vis kun valgt ankemulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </Header>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning datoOpprettet={journalpost?.datoOpprettet} vedtakDate={mulighet?.vedtakDate} />

      <Content ankemuligheter={ankemuligheter} isLoading={isLoading} />
    </CardSmall>
  );
};

const Header = styled.div`
  display: grid;
  grid-template-columns: min-content min-content 1fr;
  grid-gap: 4px;
  white-space: nowrap;
`;

const StyledButton = styled(Button)`
  flex-grow: 0;
  width: fit-content;
  align-self: flex-end;
  justify-self: right;
`;

interface ContentProps {
  ankemuligheter: IAnkemulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ ankemuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingAnkeMuligheter>
        <TableHeaders />
      </LoadingAnkeMuligheter>
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
      <Table zebraStripes size="small" id={ValidationFieldNames.MULIGHET} aria-label="Ankemuligheter">
        <TableHeaders />
        <Table.Body>
          {ankemuligheter.map((ankemulighet) => (
            <Ankemulighet key={ankemulighet.id} ankemulighet={ankemulighet} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};
