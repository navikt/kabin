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
  const { typeId, mulighet, fromJournalpost } = useMulighet();

  if (typeId !== SaksTypeEnum.ANKE || mulighet === undefined || fromJournalpost) {
    return null;
  }

  return (
    <Card>
      <HeaderReadOnly>Vedtaket anken gjelder</HeaderReadOnly>
      <SelectedMulighetBody
        muligheter={[mulighet]}
        tableLabel="Valgt ankemulighet"
        columns={COLUMNS}
        type={MulighetType.ANKE}
      />
    </Card>
  );
};

const EditableAnkemuligheter = () => {
  const { typeId, mulighet, fromJournalpost } = useMulighet();
  const { muligheter, id } = useRegistrering();
  const [refetch, { isFetching, isLoading }] = useLazyGetMuligheterQuery();
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  if (mulighet === undefined && !isExpanded) {
    setIsExpanded(true);
  }

  if (typeId !== SaksTypeEnum.ANKE || fromJournalpost) {
    return null;
  }

  if (!isExpanded && mulighet !== undefined) {
    return (
      <SelectedMulighet
        onClick={() => setIsExpanded(true)}
        buttonLabel="Vis alle ankemuligheter"
        columns={COLUMNS}
        tableLabel="Vedtaket anken gjelder"
        type={MulighetType.ANKE}
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
        label="Velg vedtaket anken gjelder"
        showOnlySelectedLabel="Vis kun valgt ankemulighet"
      />

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning mulighet={mulighet} />

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
    return <LoadingMuligheter label="Ankemuligheter" columns={COLUMNS} type={MulighetType.ANKE} selectable />;
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
    <MuligheterTable
      label="Ankemuligheter"
      muligheter={ankemuligheter}
      fieldName={ValidationFieldNames.MULIGHET}
      columns={COLUMNS}
      type={MulighetType.ANKE}
      selectable
    />
  );
};

const COLUMNS: (keyof IAnkemulighet)[] = [
  'typeId',
  'fagsakId',
  'temaId',
  'ytelseId',
  'vedtakDate',
  'originalFagsystemId',
  'sourceOfExistingBehandlinger',
];
