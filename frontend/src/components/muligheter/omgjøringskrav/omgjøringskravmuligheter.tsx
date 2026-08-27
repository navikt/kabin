import { Card, CardSmall } from '@app/components/card/card';
import { HeaderEditable, HeaderReadOnly } from '@app/components/muligheter/common/mulighet-header';
import { LoadingMuligheter } from '@app/components/muligheter/common/table/loading-muligheter';
import { MuligheterTable } from '@app/components/muligheter/common/table/table';
import { MulighetType } from '@app/components/muligheter/common/table/types';
import { Warning } from '@app/components/muligheter/common/warning';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedMulighet, SelectedMulighetBody } from '@app/components/selected/selected-mulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useLazyGetMuligheterQuery } from '@app/redux/api/registreringer/queries';
import { SaksTypeEnum } from '@app/types/common';
import type { IOmgjøringskravmulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import { useState } from 'react';

export const Omgjøringskravmuligheter = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableOmgjøringskravmuligheter />;
  }

  return <ReadOnlyOmgjøringskravmulighet />;
};

const ReadOnlyOmgjøringskravmulighet = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();

  if (typeId !== SaksTypeEnum.OMGJØRINGSKRAV || mulighet === undefined || fromJournalpost) {
    return null;
  }

  return (
    <Card>
      <HeaderReadOnly>Vedtaket omgjøringskravet gjelder</HeaderReadOnly>
      <SelectedMulighetBody
        muligheter={[mulighet]}
        tableLabel="Valgt omgjøringskravmulighet"
        columns={COLUMNS}
        type={MulighetType.OMGJØRINGSKRAV}
      />
    </Card>
  );
};

const EditableOmgjøringskravmuligheter = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();
  const { muligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.OMGJØRINGSKRAV || fromJournalpost) {
    return null;
  }

  if (!isExpanded && mulighet !== undefined) {
    return (
      <SelectedMulighet
        onClick={() => setIsExpanded(true)}
        buttonLabel="Vis alle omgjøringskravmuligheter"
        columns={COLUMNS}
        tableLabel="Vedtaket omgjøringskravet gjelder"
        type={MulighetType.OMGJØRINGSKRAV}
        muligheter={[mulighet]}
      />
    );
  }

  return (
    <CardSmall>
      <HeaderEditable
        toggleExpanded={() => setIsExpanded(!isExpanded)}
        refetch={refetch}
        isFetching={isFetching}
        mulighet={mulighet}
        id={id}
        label="Velg vedtaket omgjøringskravet gjelder"
        showOnlySelectedLabel="Vis kun valgt omgjøringskravmulighet"
      />

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning date={mulighet?.vedtakDate} type={MulighetType.OMGJØRINGSKRAV} />

      <Content omgjøringskravmuligheter={muligheter.omgjoeringskravmuligheter} isLoading={isLoading} />
    </CardSmall>
  );
};

interface ContentProps {
  omgjøringskravmuligheter: IOmgjøringskravmulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ omgjøringskravmuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingMuligheter
        label="Omgjøringskravmuligheter"
        columns={COLUMNS}
        type={MulighetType.OMGJØRINGSKRAV}
        selectable
      />
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
    <MuligheterTable
      label="Omgjøringskravmuligheter"
      muligheter={omgjøringskravmuligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      columns={COLUMNS}
      type={MulighetType.OMGJØRINGSKRAV}
      selectable
    />
  );
};

const COLUMNS: (keyof IOmgjøringskravmulighet)[] = [
  'typeId',
  'fagsakId',
  'temaId',
  'ytelseId',
  'vedtakDate',
  'originalFagsystemId',
  'sourceOfExistingBehandlinger',
];
