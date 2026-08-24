import { Card, CardSmall } from '@app/components/card/card';
import { HeaderEditable, HeaderReadOnly } from '@app/components/muligheter/common/mulighet-header';
import { LoadingMuligheter } from '@app/components/muligheter/common/table/loading-muligheter';
import { MuligheterTable } from '@app/components/muligheter/common/table/table';
import { MulighetType } from '@app/components/muligheter/common/table/types';
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
import { ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import { useState } from 'react';

export const Klagemuligheter = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableKlagemuligheter />;
  }

  return <ReadOnlyKlagemulighet />;
};

const ReadOnlyKlagemulighet = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();

  if (typeId !== SaksTypeEnum.KLAGE || mulighet === undefined || fromJournalpost) {
    return null;
  }

  return (
    <Card>
      <HeaderReadOnly>Vedtaket klagen gjelder</HeaderReadOnly>
      <SelectedKlagemulighetBody {...mulighet} />
    </Card>
  );
};

const EditableKlagemuligheter = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();
  const { muligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.VEDTAK);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.KLAGE || fromJournalpost) {
    return null;
  }

  if (!isExpanded && mulighet !== undefined) {
    return <SelectedKlagemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardSmall>
      <HeaderEditable
        toggleExpanded={() => setIsExpanded(!isExpanded)}
        refetch={refetch}
        isFetching={isFetching}
        mulighet={mulighet}
        id={id}
        label="Velg vedtaket klagen gjelder"
        showOnlySelectedLabel="Vis kun valgt klagemulighet"
      />

      <ValidationErrorMessage error={error} id={ValidationFieldNames.VEDTAK} />

      <Content klagemuligheter={muligheter.klagemuligheter} isLoading={isLoading} />
    </CardSmall>
  );
};

interface ContentProps {
  klagemuligheter: IKlagemulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ klagemuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return <LoadingKlagemuligheter />;
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
    <MuligheterTable
      label="Klagemuligheter"
      muligheter={klagemuligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      columns={COLUMNS}
      type={MulighetType.KLAGE}
    />
  );
};

const COLUMNS: (keyof IKlagemulighet)[] = [
  'fagsakId',
  'temaId',
  'vedtakDate',
  'klageBehandlendeEnhet',
  'originalFagsystemId',
];

export const LoadingKlagemuligheter = () => (
  <LoadingMuligheter label="Klagemuligheter" columns={COLUMNS} type={MulighetType.KLAGE} />
);
