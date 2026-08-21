import { Alert } from '@app/components/alert/alert';
import { CardLarge, CardSmall } from '@app/components/card/card';
import { GosysOppgaver } from '@app/components/gosys-oppgaver/gosys-oppgaver';
import { LoadingGosysOppgaver } from '@app/components/gosys-oppgaver/loading-gosys-oppgaver';
import { LoadingOverstyringer, LoadingSvarbrev } from '@app/components/loading-registrering/loading-registrering';
import { AdditionalKabalMuligheter } from '@app/components/muligheter/additional-kabal-mulighet/additional-kabal-mulighet';
import { Ankemuligheter } from '@app/components/muligheter/anke/ankemuligheter';
import { BegjæringOmGjenopptakMuligheter } from '@app/components/muligheter/begjæring-om-gjenopptak/begjæring-om-gjenopptak';
import { Journalpostmuligheter } from '@app/components/muligheter/journalpostmuligheter';
import { Klagemuligheter } from '@app/components/muligheter/klage/klagemuligheter';
import { LoadingKlagemuligheter } from '@app/components/muligheter/klage/loading-klagemuligheter';
import { Omgjøringskravmuligheter } from '@app/components/muligheter/omgjøringskrav/omgjøringskravmuligheter';
import { Overstyringer } from '@app/components/overstyringer/overstyringer';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { Svarbrev } from '@app/components/svarbrev/svarbrev';
import { getKlagerTitle } from '@app/functions/get-klager-name';
import { useAdditionalKabalMulighet } from '@app/hooks/use-additional-kabal-mulighet';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetTypeMutation } from '@app/redux/api/registreringer/mutations';
import { SaksTypeEnum } from '@app/types/common';
import { DocPencilIcon, TasklistStartIcon } from '@navikt/aksel-icons';

export const TypeInput = () => {
  const { id, typeId, mulighetIsBasedOnJournalpost } = useRegistrering();
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

  const klagerLabel = getKlagerTitle(typeId);

  if (typeId === SaksTypeEnum.ANKE) {
    return mulighetIsBasedOnJournalpost ? (
      <>
        <Journalpostmuligheter />
        <WillCreateNewJournalpostInfo />
        <AdditionalKabalMuligheter />
        <GosysOppgaver />
        <Overstyringer
          title="Tilpass anken"
          klagerLabel={klagerLabel}
          saksbehandlerFromMulighetLabel="Fra journalpost"
        />
        <Svarbrev />
      </>
    ) : (
      <>
        <Ankemuligheter />
        <WillCreateNewJournalpostInfo />
        <AdditionalKabalMuligheter />
        <GosysOppgaver />
        <Overstyringer title="Tilpass anken" klagerLabel={klagerLabel} saksbehandlerFromMulighetLabel="Fra klagen" />
        <Svarbrev />
      </>
    );
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return mulighetIsBasedOnJournalpost ? (
      <>
        <Journalpostmuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer
          title="Tilpass klagen"
          klagerLabel={klagerLabel}
          saksbehandlerFromMulighetLabel="Fra journalpost"
        />
        <Svarbrev />
      </>
    ) : (
      <>
        <Klagemuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer title="Tilpass klagen" klagerLabel={klagerLabel} saksbehandlerFromMulighetLabel="Fra klagen" />
        <Svarbrev />
      </>
    );
  }

  if (typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return mulighetIsBasedOnJournalpost ? (
      <>
        <Journalpostmuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer
          title="Tilpass omgjøringskravet"
          klagerLabel={klagerLabel}
          saksbehandlerFromMulighetLabel="Fra journalpost"
        />
        <Svarbrev />
      </>
    ) : (
      <>
        <Omgjøringskravmuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer
          title="Tilpass omgjøringskravet"
          klagerLabel={klagerLabel}
          saksbehandlerFromMulighetLabel="Fra tidligere behandling"
        />
        <Svarbrev />
      </>
    );
  }

  if (typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK) {
    return mulighetIsBasedOnJournalpost ? (
      <>
        <Journalpostmuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer
          title="Tilpass begjæringen om gjenopptak"
          klagerLabel="Den som begjærer gjenopptak"
          saksbehandlerFromMulighetLabel="Fra journalpost"
        />
        <Svarbrev />
      </>
    ) : (
      <>
        <BegjæringOmGjenopptakMuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer
          title="Tilpass begjæringen om gjenopptak"
          klagerLabel="Den som begjærer gjenopptak"
          saksbehandlerFromMulighetLabel="Fra tidligere behandling"
        />
        <Svarbrev />
      </>
    );
  }

  return <NoType />;
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

const WillCreateNewJournalpostInfo = () => {
  const { willCreateNewJournalpost, finished } = useRegistrering();
  const journalpostAndMulighet = useJournalpostAndMulighet();

  if (!willCreateNewJournalpost || journalpostAndMulighet === null || finished !== null) {
    return null;
  }

  const fromId = <b>{journalpostAndMulighet.fromId ?? 'ukjent'}</b>;
  const toId = <b>{journalpostAndMulighet.toId ?? 'ukjent'}</b>;

  return (
    <Alert variant="info">
      Journalposten er tidligere journalført på fagsak-ID {fromId}. Ved opprettelse av behandling i Kabal vil innholdet
      kopieres over i en ny journalpost på fagsak-ID {toId}.
    </Alert>
  );
};

const useJournalpostAndMulighet = () => {
  const { journalpost } = useJournalpost();
  const { mulighet, fromJournalpost } = useMulighet();
  const additionalKabalMulighet = useAdditionalKabalMulighet();

  if (journalpost === undefined || mulighet === undefined || fromJournalpost) {
    return null;
  }

  return {
    fromId: journalpost.sak?.fagsakId ?? null,
    toId: additionalKabalMulighet?.fagsakId ?? mulighet.fagsakId,
  };
};
