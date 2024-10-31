import { Card, CardSmall } from '@app/components/card/card';
import { Mulighet } from '@app/components/muligheter/anke/ankemulighet';
import { LoadingAnkeMuligheter } from '@app/components/muligheter/anke/loading-ankemuligheter';
import { TableHeaders } from '@app/components/muligheter/anke/table-headers';
import { TableContainer } from '@app/components/muligheter/common/styled-components';
import { Warning } from '@app/components/muligheter/common/warning';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedMulighet, SelectedMulighetBody } from '@app/components/selected/selected-ankemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useLazyGetMuligheterQuery } from '@app/redux/api/registreringer/queries';
import { SaksTypeEnum } from '@app/types/common';
import type { IAnkemulighet, IOmgjøringskravmulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ArrowsCirclepathIcon, ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Table } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';

type Type = SaksTypeEnum.ANKE | SaksTypeEnum.OMGJØRINGSKRAV;

interface Props {
  type: Type;
}

export const AnkeOrOmgjøringskravMuligheter = ({ type }: Props) => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableMuligheter type={type} />;
  }

  return <ReadOnlyAnkemulighet type={type} />;
};

const ReadOnlyAnkemulighet = ({ type }: Props) => {
  const { typeId, mulighet } = useMulighet();

  if ((typeId !== SaksTypeEnum.ANKE && typeId !== SaksTypeEnum.OMGJØRINGSKRAV) || mulighet === undefined) {
    return null;
  }

  return (
    <Card>
      <Header>
        <Heading level="1" size="small">
          Vedtaket {type === SaksTypeEnum.ANKE ? 'anken' : 'omgjøringskravet'} gjelder
        </Heading>
      </Header>

      <SelectedMulighetBody {...mulighet} />
    </Card>
  );
};

const EditableMuligheter = ({ type }: Props) => {
  const { typeId, mulighet } = useMulighet();
  const { journalpost } = useJournalpost();
  const { ankemuligheter, omgjøringskravmuligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.ANKE && typeId !== SaksTypeEnum.OMGJØRINGSKRAV) {
    return null;
  }

  if (!isExpanded && mulighet !== undefined) {
    return <SelectedMulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardSmall>
      <Header>
        <Heading level="1" size="small">
          Velg vedtaket {type === SaksTypeEnum.ANKE ? 'anken' : 'omgjøringskravet'} gjelder
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
            title={`Vis kun valgt ${type === SaksTypeEnum.ANKE ? 'anke' : 'omgjøringskrav'}mulighet`}
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </Header>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning datoOpprettet={journalpost?.datoOpprettet} vedtakDate={mulighet?.vedtakDate} />

      <Content
        muligheter={type === SaksTypeEnum.ANKE ? ankemuligheter : omgjøringskravmuligheter}
        isLoading={isLoading}
        type={type}
      />
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
  muligheter: IAnkemulighet[] | IOmgjøringskravmulighet[] | undefined;
  isLoading: boolean;
  type: Type;
}

const Content = ({ muligheter, isLoading, type }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingAnkeMuligheter>
        <TableHeaders />
      </LoadingAnkeMuligheter>
    );
  }

  if (muligheter === undefined) {
    return (
      <Placeholder>
        <ParagraphIcon aria-hidden />
      </Placeholder>
    );
  }

  if (muligheter.length === 0) {
    return <BodyShort>Ingen {type === SaksTypeEnum.ANKE ? 'anke' : 'omgjøringskrav'}muligheter</BodyShort>;
  }

  return (
    <TableContainer $showShadow={muligheter.length >= 3}>
      <Table
        zebraStripes
        size="small"
        id={ValidationFieldNames.MULIGHET}
        aria-label={`${type === SaksTypeEnum.ANKE ? 'Anke' : 'Omgjøringskrav'}muligheter`}
      >
        <TableHeaders />
        <Table.Body>
          {muligheter.map((ankemulighet) => (
            <Mulighet key={ankemulighet.id} mulighet={ankemulighet} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};
