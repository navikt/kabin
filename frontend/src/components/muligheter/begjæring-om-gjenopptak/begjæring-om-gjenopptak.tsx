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
import { useSetNonAnkemulighetMutation } from '@app/redux/api/registreringer/mutations';
import { useLazyGetMuligheterQuery } from '@app/redux/api/registreringer/queries';
import { SaksTypeEnum } from '@app/types/common';
import type { IBegjæringOmGjenopptakMulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import { useState } from 'react';

export const BegjæringOmGjenopptakMuligheter = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableBegjæringOmGjenopptakMuligheter />;
  }

  return <ReadOnlyBegjæringOmGjenopptakMulighet />;
};

const ReadOnlyBegjæringOmGjenopptakMulighet = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();

  if (typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK || mulighet === undefined || fromJournalpost) {
    return null;
  }

  return (
    <Card>
      <HeaderReadOnly />
      <SelectedNonKlageMulighetBody {...mulighet} />
    </Card>
  );
};

const EditableBegjæringOmGjenopptakMuligheter = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();
  const { journalpost } = useJournalpost();
  const { gjenopptaksmuligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK || fromJournalpost) {
    return null;
  }

  if (!isExpanded && mulighet !== undefined) {
    return (
      <SelectedNonKlageMulighet
        onClick={() => setIsExpanded(true)}
        label="Vis alle muligheter for begjæring om gjenopptak"
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
        label="Velg behandlingen begjæringen om gjenopptak gjelder"
        showOnlySelectedLabel="Vis kun valgt mulighet for begjæring om gjenopptak"
      />

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning datoOpprettet={journalpost?.datoOpprettet} vedtakDate={mulighet?.vedtakDate} />

      <Content begjæringOmGjenopptakMuligheter={gjenopptaksmuligheter} isLoading={isLoading} />
    </CardSmall>
  );
};

interface ContentProps {
  begjæringOmGjenopptakMuligheter: IBegjæringOmGjenopptakMulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ begjæringOmGjenopptakMuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingNonKlagemuligheter label="Muligheter for beegjæring om gjenopptak">
        <NonKlageTableHeaders />
      </LoadingNonKlagemuligheter>
    );
  }

  if (begjæringOmGjenopptakMuligheter === undefined) {
    return (
      <Placeholder>
        <ParagraphIcon aria-hidden />
      </Placeholder>
    );
  }

  if (begjæringOmGjenopptakMuligheter.length === 0) {
    return <BodyShort>Ingen muligheter for begjæring om gjenopptak</BodyShort>;
  }

  return (
    <MulighetTable
      label="Muligheter for begjæring om gjenopptak"
      headers={<NonKlageTableHeaders />}
      muligheter={begjæringOmGjenopptakMuligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      setMulighetHook={useSetNonAnkemulighetMutation}
    />
  );
};
