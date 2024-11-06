import { CardLarge, CardSmall } from '@app/components/card/card';
import { GosysOppgaver } from '@app/components/gosys-oppgaver/gosys-oppgaver';
import { LoadingGosysOppgaver } from '@app/components/gosys-oppgaver/loading-gosys-oppgaver';
import { LoadingOverstyringer, LoadingSvarbrev } from '@app/components/loading-registrering/loading-registrering';
import { Ankemuligheter } from '@app/components/muligheter/anke/ankemuligheter';
import { Klagemuligheter } from '@app/components/muligheter/klage/klagemuligheter';
import { LoadingKlagemuligheter } from '@app/components/muligheter/klage/loading-klagemuligheter';
import { Omgjøringskravemuligheter } from '@app/components/muligheter/omgjøringskrav/omgjøringskravmuligheter';
import { Overstyringer } from '@app/components/overstyringer/overstyringer';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { Svarbrev } from '@app/components/svarbrev/svarbrev';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetTypeMutation } from '@app/redux/api/registreringer/mutations';
import { type RegistreringType, SaksTypeEnum, isType } from '@app/types/common';
import { DocPencilIcon, TasklistStartIcon } from '@navikt/aksel-icons';
import { Alert, Tag, ToggleGroup } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';

const ReadOnlyType = ({ typeId }: { typeId: RegistreringType | null }) => {
  switch (typeId) {
    case SaksTypeEnum.ANKE:
      return (
        <Tag variant="alt1" size="medium">
          Anke
        </Tag>
      );
    case SaksTypeEnum.KLAGE:
      return (
        <Tag variant="info" size="medium">
          Klage
        </Tag>
      );
    case null:
      return (
        <Tag variant="info" size="medium">
          Ingen sakstype valgt
        </Tag>
      );
  }
};

export const TypeSelect = () => {
  const { id, typeId, journalpostId } = useRegistrering();
  const [setType] = useSetTypeMutation({ fixedCacheKey: id });
  const canEdit = useCanEdit();

  const onChange = useCallback(
    (newTypeId: string) => {
      if (!isType(newTypeId)) {
        return;
      }

      setType({ id, typeId: newTypeId });
    },
    [id, setType],
  );

  if (!canEdit) {
    return (
      <Row>
        <ReadOnlyType typeId={typeId} />
      </Row>
    );
  }

  if (journalpostId === null) {
    return (
      <Row>
        <Alert variant="info" size="small" inline>
          Velg journalpost.
        </Alert>
      </Row>
    );
  }

  const value = typeId ?? undefined;

  // Without `key` TogglegGroup will remember last non-undefined value when undefined.
  return (
    <Row>
      <ToggleGroup onChange={onChange} value={value ?? 'none'} size="small" key={value === undefined ? 'none' : 'some'}>
        <ToggleGroup.Item value={SaksTypeEnum.KLAGE}>Klage</ToggleGroup.Item>
        <ToggleGroup.Item value={SaksTypeEnum.ANKE}>Anke</ToggleGroup.Item>
        <ToggleGroup.Item value={SaksTypeEnum.OMGJØRINGSKRAV}>Omgjøringskrav</ToggleGroup.Item>
      </ToggleGroup>
    </Row>
  );
};

const NoType = () => (
  <>
    <CardSmall>
      <Placeholder>
        <TasklistStartIcon aria-hidden />
      </Placeholder>
    </CardSmall>
    <CardLarge>
      <Placeholder>
        <DocPencilIcon aria-hidden />
      </Placeholder>
    </CardLarge>
  </>
);

export const TypeInput = () => {
  const { id, typeId } = useRegistrering();
  const [, { isLoading }] = useSetTypeMutation({ fixedCacheKey: id });

  if (isLoading) {
    return (
      <>
        <CardSmall>
          <LoadingKlagemuligheter />
        </CardSmall>
        <LoadingGosysOppgaver />
        <LoadingOverstyringer />
        <LoadingSvarbrev />
      </>
    );
  }

  if (typeId === SaksTypeEnum.ANKE) {
    return (
      <>
        <Ankemuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer title="Tilpass anken" klagerLabel="Ankende part" saksbehandlerFromMulighetLabel="Fra klagen" />
        <Svarbrev />
      </>
    );
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return (
      <>
        <Klagemuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer title="Tilpass klagen" klagerLabel="Klager" saksbehandlerFromMulighetLabel="Fra klagen" />
        <Svarbrev />
      </>
    );
  }

  if (typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return (
      <>
        <Omgjøringskravemuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer
          title="Tilpass omgjøringskravet"
          klagerLabel="Den som krever omgjøring"
          saksbehandlerFromMulighetLabel="Fra tidligere behandling"
        />
        <Svarbrev />
      </>
    );
  }

  return <NoType />;
};

const WillCreateNewJournalpostInfo = () => {
  const { willCreateNewJournalpost, finished } = useRegistrering();
  const journalpostAndMulighet = useJournalpostAndMulighet();

  if (!willCreateNewJournalpost || journalpostAndMulighet === null || finished !== null) {
    return null;
  }

  const fromId = <b>{journalpostAndMulighet.journalpost.sak?.fagsakId ?? 'ukjent'}</b>;
  const toId = <b>{journalpostAndMulighet.mulighet.fagsakId}</b>;

  return (
    <Alert variant="info" size="small">
      Journalposten er tidligere journalført på fagsak-ID {fromId}. Ved opprettelse av behandling i Kabal vil innholdet
      kopieres over i en ny journalpost på fagsak-ID {toId}.
    </Alert>
  );
};

const useJournalpostAndMulighet = () => {
  const { journalpost } = useJournalpost();
  const { mulighet } = useMulighet();

  if (journalpost === undefined || mulighet === undefined) {
    return null;
  }

  return { journalpost, mulighet };
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 42px;
  flex-shrink: 0;
`;
