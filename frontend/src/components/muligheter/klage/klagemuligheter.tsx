import { Card, CardSmall } from '@app/components/card/card';
import { TableContainer } from '@app/components/muligheter/common/styled-components';
import { Klagemulighet } from '@app/components/muligheter/klage/klagemulighet';
import { LoadingKlagemuligheter } from '@app/components/muligheter/klage/loading-klagemuligheter';
import { TableHeaders } from '@app/components/muligheter/klage/table-headers';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedKlagemulighet, SelectedKlagemulighetBody } from '@app/components/selected/selected-klagemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useLazyGetMuligheterQuery } from '@app/redux/api/registreringer/queries';
import { SaksTypeEnum } from '@app/types/common';
import type { IKlagemulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ArrowsCirclepathIcon, ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Table } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';

export const Klagemuligheter = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableKlagemuligheter />;
  }

  return <ReadOnlyKlagemulighet />;
};

const ReadOnlyKlagemulighet = () => {
  const { typeId, mulighet } = useMulighet();

  if (typeId !== SaksTypeEnum.KLAGE || mulighet === undefined) {
    return null;
  }

  return (
    <Card>
      <Header>
        <Heading level="1" size="small">
          Vedtaket klagen gjelder
        </Heading>
      </Header>
      <SelectedKlagemulighetBody {...mulighet} />
    </Card>
  );
};

const EditableKlagemuligheter = () => {
  const { typeId, mulighet } = useMulighet();
  const { klagemuligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.VEDTAK);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.KLAGE) {
    return null;
  }

  if (!isExpanded && mulighet !== null) {
    return <SelectedKlagemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardSmall>
      <Header>
        <Heading level="1" size="small">
          Velg vedtaket klagen gjelder
        </Heading>

        <Button
          size="xsmall"
          variant="tertiary"
          onClick={() => refetch(id)}
          loading={isFetching}
          icon={<ArrowsCirclepathIcon aria-hidden />}
          title="Oppdater"
        />

        {mulighet === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            title="Vis kun valgt klagemulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </Header>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.VEDTAK} />

      <Content klagemuligheter={klagemuligheter} isLoading={isLoading} />
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
  klagemuligheter: IKlagemulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ klagemuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingKlagemuligheter>
        <TableHeaders />
      </LoadingKlagemuligheter>
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
      <Table zebraStripes size="small" id={ValidationFieldNames.MULIGHET} aria-label="Klagemuligheter">
        <TableHeaders />
        <Table.Body>
          {klagemuligheter.map((klagemulighet) => (
            <Klagemulighet key={klagemulighet.id} klagemulighet={klagemulighet} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};
