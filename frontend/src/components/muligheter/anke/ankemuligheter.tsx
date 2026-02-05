import { Card, CardSmall } from '@app/components/card/card';
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
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetAnkemulighetMutation } from '@app/redux/api/registreringer/mutations';
import { useLazyGetMuligheterQuery } from '@app/redux/api/registreringer/queries';
import { SaksTypeEnum } from '@app/types/common';
import type { IAnkemulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import { useState } from 'react';

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
      <HeaderReadOnly />
      <SelectedNonKlageMulighetBody {...mulighet} />
    </Card>
  );
};

const EditableAnkemuligheter = () => {
  const { typeId, mulighet } = useMulighet();
  const { journalpost } = useJournalpost();
  const { muligheter, id } = useRegistrering();
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
    return <SelectedNonKlageMulighet onClick={() => setIsExpanded(true)} label="Vis alle ankemuligheter" />;
  }

  return (
    <CardSmall>
      <HeaderEditable
        toggleExpanded={() => setIsExpanded(!isExpanded)}
        refetch={refetch}
        isFetching={isFetching}
        mulighet={mulighet}
        id={id}
        label="Velg vedtaket anken gjelder"
        showOnlySelectedLabel="Vis kun valgt ankemulighet"
      />

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning datoOpprettet={journalpost?.datoOpprettet} vedtakDate={mulighet?.vedtakDate} />

      <Content ankemuligheter={muligheter.ankemuligheter} isLoading={isLoading} />
    </CardSmall>
  );
};

interface ContentProps {
  ankemuligheter: IAnkemulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ ankemuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingNonKlagemuligheter label="Ankemuligheter">
        <NonKlageTableHeaders />
      </LoadingNonKlagemuligheter>
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
    <MulighetTable
      label="Ankemuligheter"
      headers={<NonKlageTableHeaders />}
      muligheter={ankemuligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      setMulighetHook={useSetAnkemulighetMutation}
    />
  );
};
