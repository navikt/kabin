import { Card } from '@app/components/card/card';
import { LoadingNonKlagemuligheter } from '@app/components/muligheter/common/loading-non-klage-muligheter';
import { HeaderEditable, HeaderReadOnly } from '@app/components/muligheter/common/mulighet-header';
import { MulighetTable } from '@app/components/muligheter/common/table';
import { NonKlageTableHeaders } from '@app/components/muligheter/common/table-headers';
import { Warning } from '@app/components/muligheter/common/warning';
import { Placeholder } from '@app/components/placeholder/placeholder';
import {
  SelectedNonKlageMulighet,
  SelectedNonKlageMulighetBody,
} from '@app/components/selected/selected-non-klagemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useAdditionalKabalMulighet } from '@app/hooks/use-additional-kabal-mulighet';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetAdditionalKabalMulighetMutation } from '@app/redux/api/registreringer/mutations';
import { useLazyGetAdditionalKabalMuligheterQuery } from '@app/redux/api/registreringer/queries';
import type { IAdditionalKabalMulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
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
  const { journalpost } = useJournalpost();
  const { id, additionalKabalMuligheter } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetAdditionalKabalMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

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

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning datoOpprettet={journalpost?.datoOpprettet} vedtakDate={mulighet?.vedtakDate} />

      <Content muligheter={additionalKabalMuligheter} isLoading={isLoading} />
    </Card>
  );
};

interface ContentProps {
  muligheter: IAdditionalKabalMulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ muligheter, isLoading }: ContentProps) => {
  const mulighet = useAdditionalKabalMulighet();

  if (isLoading) {
    return (
      <LoadingNonKlagemuligheter label="Tidligere behandlinger i Kabal som anken gjelder">
        <NonKlageTableHeaders />
      </LoadingNonKlagemuligheter>
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
    return <BodyShort>Ingen tidligere behandlinger i Kabal</BodyShort>;
  }

  return (
    <MulighetTable
      label="Kabal-muligheter"
      headers={<NonKlageTableHeaders />}
      muligheter={muligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      setMulighetHook={useSetAdditionalKabalMulighetMutation}
      selectedMulighet={mulighet}
    />
  );
};
