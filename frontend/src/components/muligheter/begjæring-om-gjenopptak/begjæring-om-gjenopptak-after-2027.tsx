import { Card, CardSmall } from '@app/components/card/card';
import { HeaderEditable } from '@app/components/muligheter/common/mulighet-header';
import { LoadingMuligheter } from '@app/components/muligheter/common/table/loading-muligheter';
import { MuligheterTable } from '@app/components/muligheter/common/table/table';
import { MulighetType } from '@app/components/muligheter/common/table/types';
import { Warning } from '@app/components/muligheter/common/warning';
import { MulighetWarningForSakFraTRAfter2027 } from '@app/components/muligheter/sak-fra-tr-after-2027-warnings';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedMulighet, SelectedMulighetBody } from '@app/components/selected/selected-mulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useLazyGetMuligheterQuery } from '@app/redux/api/registreringer/queries';
import { SaksTypeEnum } from '@app/types/common';
import type { IBegjæringOmGjenopptakMulighetAfter2027 } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading } from '@navikt/ds-react';
import { useState } from 'react';

export const BegjæringOmGjenopptakMuligheterAfter2027 = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableBegjæringOmGjenopptakAfter2027 />;
  }

  return <ReadOnlyBegjæringOmGjenopptakAfter2027 />;
};

const ReadOnlyBegjæringOmGjenopptakAfter2027 = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();

  if (typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027 || mulighet === undefined || fromJournalpost) {
    return null;
  }

  return (
    <Card>
      <Heading level="1" size="small">
        Vedtaket begjæringen om gjenopptak gjelder
      </Heading>
      <SelectedMulighetBody
        muligheter={[mulighet]}
        tableLabel="Valgt begjæring om gjenopptak"
        columns={COLUMNS}
        type={MulighetType.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027}
      />
    </Card>
  );
};

const EditableBegjæringOmGjenopptakAfter2027 = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();
  const { muligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027 || fromJournalpost) {
    return null;
  }

  if (!isExpanded && mulighet !== undefined) {
    return (
      <SelectedMulighet
        onClick={() => setIsExpanded(true)}
        buttonLabel="Vis alle muligheter for begjæring om gjenopptak"
        columns={COLUMNS}
        tableLabel="Vedtaket begjæringen om gjenopptak gjelder"
        type={MulighetType.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027}
        muligheter={[mulighet]}
      />
    );
  }

  return (
    <>
      <CardSmall>
        <HeaderEditable
          toggleExpanded={() => setIsExpanded(!isExpanded)}
          refetch={refetch}
          isFetching={isFetching}
          mulighet={mulighet}
          id={id}
          label="Velg vedtaket begjæringen om gjenopptak gjelder"
          showOnlySelectedLabel="Vis kun valgt mulighet for begjæring om gjenopptak"
        />

        <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

        <Warning mulighet={mulighet} />

        <Content muligheter={muligheter.gjenopptaksmuligheterEtter2027} isLoading={isLoading} />
      </CardSmall>
      <MulighetWarningForSakFraTRAfter2027 mulighet={mulighet} />
    </>
  );
};

interface ContentProps {
  muligheter: IBegjæringOmGjenopptakMulighetAfter2027[] | undefined;
  isLoading: boolean;
}

const Content = ({ muligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <LoadingMuligheter
        label="Muligheter for begjæring om gjenopptak"
        columns={COLUMNS}
        type={MulighetType.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027}
        selectable
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

  if (muligheter.length === 0) {
    return <BodyShort>Ingen muligheter for begjæring om gjenopptak</BodyShort>;
  }

  return (
    <MuligheterTable
      label="Muligheter for begjæring om gjenopptak"
      muligheter={muligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      columns={COLUMNS}
      type={MulighetType.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027}
      selectable
    />
  );
};

const COLUMNS: (keyof IBegjæringOmGjenopptakMulighetAfter2027)[] = [
  'typeId',
  'saksnummer',
  'temaId',
  'ytelseId',
  'vedtakDate',
  'originalFagsystemId',
  'sourceOfExistingBehandlinger',
];
