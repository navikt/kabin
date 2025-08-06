import { Card, CardSmall } from '@app/components/card/card';
import { Warning } from '@app/components/muligheter/common/warning';
import { LoadingOmgjøringskravMuligheter } from '@app/components/muligheter/omgjøringskrav/loading-omgjøringskravmuligheter';
import { Omgjøringskravmulighet } from '@app/components/muligheter/omgjøringskrav/omgjøringskravmulighet';
import { TableHeaders } from '@app/components/muligheter/omgjøringskrav/table-headers';
import { Placeholder } from '@app/components/placeholder/placeholder';
import {
  SelectedOmgjøringskravmulighet,
  SelectedOmgjøringskravmulighetBody,
} from '@app/components/selected/selected-omgjøringskravmulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useLazyGetMuligheterQuery } from '@app/redux/api/registreringer/queries';
import { SaksTypeEnum } from '@app/types/common';
import type { IOmgjøringskravmulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ArrowsCirclepathIcon, ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Table } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';

export const Omgjøringskravmuligheter = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableOmgjøringskravmuligheter />;
  }

  return <ReadOnlyOmgjøringskravmulighet />;
};

const ReadOnlyOmgjøringskravmulighet = () => {
  const { typeId, mulighet } = useMulighet();

  if (typeId !== SaksTypeEnum.OMGJØRINGSKRAV || mulighet === undefined) {
    return null;
  }

  return (
    <Card>
      <Header>
        <Heading level="1" size="small">
          Vedtaket klagen gjelder
        </Heading>
      </Header>

      <SelectedOmgjøringskravmulighetBody {...mulighet} />
    </Card>
  );
};

const EditableOmgjøringskravmuligheter = () => {
  const { typeId, mulighet } = useMulighet();
  const { journalpost } = useJournalpost();
  const { omgjoeringskravmuligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.OMGJØRINGSKRAV) {
    return null;
  }

  if (!isExpanded && mulighet !== undefined) {
    return <SelectedOmgjøringskravmulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardSmall>
      <Header>
        <Heading level="1" size="small">
          Velg vedtaket omgjøringskravet gjelder
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
            title="Vis kun valgt omgjøringskravmulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </Header>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning datoOpprettet={journalpost?.datoOpprettet} vedtakDate={mulighet?.vedtakDate} />

      <Content omgjøringskravmuligheter={omgjoeringskravmuligheter} isLoading={isLoading} />
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
  omgjøringskravmuligheter: IOmgjøringskravmulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ omgjøringskravmuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingOmgjøringskravMuligheter>
        <TableHeaders />
      </LoadingOmgjøringskravMuligheter>
    );
  }

  if (omgjøringskravmuligheter === undefined) {
    return (
      <Placeholder>
        <ParagraphIcon aria-hidden />
      </Placeholder>
    );
  }

  if (omgjøringskravmuligheter.length === 0) {
    return <BodyShort>Ingen omgjøringskravmuligheter</BodyShort>;
  }

  return (
    <div className="overflow-y-auto">
      <Table zebraStripes size="small" id={ValidationFieldNames.MULIGHET} aria-label="Omgjøringskravmuligheter">
        <TableHeaders />
        <Table.Body>
          {omgjøringskravmuligheter.map((omgjøringskravmulighet) => (
            <Omgjøringskravmulighet key={omgjøringskravmulighet.id} omgjøringskravmulighet={omgjøringskravmulighet} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
