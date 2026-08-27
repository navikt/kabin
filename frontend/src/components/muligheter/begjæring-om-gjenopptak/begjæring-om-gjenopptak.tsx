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
      <HeaderReadOnly>Vedtaket begjæringen om gjenopptak gjelder</HeaderReadOnly>
      <SelectedMulighetBody
        muligheter={[mulighet]}
        tableLabel="Valgt begjæring om gjenopptak"
        columns={COLUMNS}
        type={MulighetType.BEGJÆRING_OM_GJENOPPTAK}
      />
    </Card>
  );
};

const EditableBegjæringOmGjenopptakMuligheter = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();
  const { muligheter, id } = useRegistrering();
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
      <SelectedMulighet
        onClick={() => setIsExpanded(true)}
        buttonLabel="Vis alle muligheter for begjæring om gjenopptak"
        columns={COLUMNS}
        tableLabel="Vedtaket begjæringen om gjenopptak gjelder"
        type={MulighetType.BEGJÆRING_OM_GJENOPPTAK}
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
        label="Velg behandlingen begjæringen om gjenopptak gjelder"
        showOnlySelectedLabel="Vis kun valgt mulighet for begjæring om gjenopptak"
      />

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning mulighet={mulighet} />

      <Content begjæringOmGjenopptakMuligheter={muligheter.gjenopptaksmuligheter} isLoading={isLoading} />
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
      <LoadingMuligheter
        label="Muligheter for begjæring om gjenopptak"
        columns={COLUMNS}
        type={MulighetType.BEGJÆRING_OM_GJENOPPTAK}
        selectable
      />
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
    <MuligheterTable
      label="Muligheter for begjæring om gjenopptak"
      muligheter={begjæringOmGjenopptakMuligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      columns={COLUMNS}
      type={MulighetType.BEGJÆRING_OM_GJENOPPTAK}
      selectable
    />
  );
};

const COLUMNS: (keyof IBegjæringOmGjenopptakMulighet)[] = [
  'typeId',
  'fagsakId',
  'temaId',
  'ytelseId',
  'kjennelseMottatt',
  'originalFagsystemId',
  'sourceOfExistingBehandlinger',
];
