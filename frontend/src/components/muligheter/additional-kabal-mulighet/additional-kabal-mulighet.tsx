import { Card } from '@app/components/card/card';
import { HeaderEditable, HeaderReadOnly } from '@app/components/muligheter/common/mulighet-header';
import { LoadingMuligheter } from '@app/components/muligheter/common/table/loading-muligheter';
import { MuligheterTable } from '@app/components/muligheter/common/table/table';
import { MulighetType } from '@app/components/muligheter/common/table/types';
import { Warning } from '@app/components/muligheter/common/warning';
import { Placeholder } from '@app/components/placeholder/placeholder';
import {
  SelectedNonKlageMulighet,
  SelectedNonKlageMulighetBody,
} from '@app/components/selected/selected-non-klagemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useAdditionalKabalMulighet } from '@app/hooks/use-additional-kabal-mulighet';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useLazyGetAdditionalKabalMuligheterQuery } from '@app/redux/api/registreringer/queries';
import type { IAdditionalKabalMulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ParagraphIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

export const AdditionalKabalMuligheter = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableAdditionalKabalMuligheter />;
  }

  return <ReadOnlyAdditionalKabalMuligheter />;
};

const ReadOnlyAdditionalKabalMuligheter = () => {
  const mulighet = useAdditionalKabalMulighet();

  if (mulighet === null) {
    return null;
  }

  return (
    <Card>
      <HeaderReadOnly>Vedtaket saken gjelder</HeaderReadOnly>
      <SelectedNonKlageMulighetBody {...mulighet} />
    </Card>
  );
};

const EditableAdditionalKabalMuligheter = () => {
  const mulighet = useAdditionalKabalMulighet();
  const { id, additionalKabalMuligheter } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetAdditionalKabalMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.ADDITIONAL_KABAL_MULIGHET);

  if (additionalKabalMuligheter.length === 0) {
    return null;
  }

  if (mulighet === null && !isExpanded) {
    setIsExpanded(true);
  }

  if (!isExpanded && mulighet !== null) {
    return (
      <SelectedNonKlageMulighet onClick={() => setIsExpanded(true)} label="Vis alle tidligere behandlinger i Kabal" />
    );
  }

  return (
    <Card>
      <HeaderEditable
        toggleExpanded={() => setIsExpanded(!isExpanded)}
        refetch={refetch}
        isFetching={isFetching}
        mulighet={mulighet ?? undefined}
        id={id}
        label="Velg tidligere behandling i Kabal som anken gjelder"
        showOnlySelectedLabel="Vis kun valgt tidligere behandling i Kabal"
      />

      <ValidationErrorMessage error={error} id={ValidationFieldNames.ADDITIONAL_KABAL_MULIGHET} />

      <Warning date={mulighet?.vedtakDate} label="Vedtaksdato" />

      <Content muligheter={additionalKabalMuligheter} isLoading={isLoading} />
    </Card>
  );
};

interface ContentProps {
  muligheter: IAdditionalKabalMulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ muligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingMuligheter
        label="Tidligere behandlinger i Kabal som anken gjelder"
        columns={COLUMNS}
        type={MulighetType.ADDITIONAL_KABAL_MULIGHET}
      />
    );
  }

  if (muligheter === undefined) {
    return (
      <Placeholder>
        <ParagraphIcon aria-hidden />
      </Placeholder>
    );
  }

  return (
    <MuligheterTable
      label="Kabal-muligheter"
      muligheter={muligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      columns={COLUMNS}
      type={MulighetType.ADDITIONAL_KABAL_MULIGHET}
    />
  );
};

const COLUMNS: (keyof IAdditionalKabalMulighet)[] = [
  'typeId',
  'fagsakId',
  'temaId',
  'ytelseId',
  'vedtakDate',
  'originalFagsystemId',
  'sourceOfExistingBehandlinger',
];
