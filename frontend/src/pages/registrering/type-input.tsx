import { Alert } from '@app/components/alert/alert';
import { CardLarge, CardSmall } from '@app/components/card/card';
import { GosysOppgaver } from '@app/components/gosys-oppgaver/gosys-oppgaver';
import { LoadingGosysOppgaver } from '@app/components/gosys-oppgaver/loading-gosys-oppgaver';
import { LoadingOverstyringer, LoadingSvarbrev } from '@app/components/loading-registrering/loading-registrering';
import { AdditionalKabalMuligheter } from '@app/components/muligheter/additional-kabal-mulighet/additional-kabal-mulighet';
import { Ankemuligheter } from '@app/components/muligheter/anke/ankemuligheter';
import { AnkemuligheterAfter2027 } from '@app/components/muligheter/anke/ankemuligheter-after-2027';
import { BegjæringOmGjenopptakMuligheter } from '@app/components/muligheter/begjæring-om-gjenopptak/begjæring-om-gjenopptak';
import { BegjæringOmGjenopptakMuligheterAfter2027 } from '@app/components/muligheter/begjæring-om-gjenopptak/begjæring-om-gjenopptak-after-2027';
import { Journalpostmuligheter } from '@app/components/muligheter/journalpostmuligheter';
import { Klagemuligheter, LoadingKlagemuligheter } from '@app/components/muligheter/klage/klagemuligheter';
import { Omgjøringskravmuligheter } from '@app/components/muligheter/omgjøringskrav/omgjøringskravmuligheter';
import {
  JournalpostForSakFraTRAfter2027Warning,
  JournalpostForSakFraTRBefore2027Warning,
} from '@app/components/muligheter/sak-fra-tr-after-2027-warnings';
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

  if (typeId === SaksTypeEnum.ANKE_AFTER_2027) {
    return mulighetIsBasedOnJournalpost ? (
      <>
        <Journalpostmuligheter />
        <JournalpostForSakFraTRAfter2027Warning />
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
        <AnkemuligheterAfter2027 />
        <WillCreateNewJournalpostInfo />
        <AdditionalKabalMuligheter />
        <GosysOppgaver />
        <Overstyringer title="Tilpass anken" klagerLabel={klagerLabel} saksbehandlerFromMulighetLabel="Fra klagen" />
        <Svarbrev />
      </>
    );
  }

  if (typeId === SaksTypeEnum.ANKE) {
    return mulighetIsBasedOnJournalpost ? (
      <>
        <Journalpostmuligheter />
        <JournalpostForSakFraTRBefore2027Warning />
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

  if (typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027) {
    return mulighetIsBasedOnJournalpost ? (
      <>
        <Journalpostmuligheter />
        <JournalpostForSakFraTRAfter2027Warning />
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
        <BegjæringOmGjenopptakMuligheterAfter2027 />
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
      Journalposten er tidligere journalført på saksnummer {fromId}. Ved opprettelse av behandling i Kabal vil innholdet
      kopieres over i en ny journalpost på saksnummer {toId}.
    </Alert>
  );
};

const useJournalpostAndMulighet = () => {
  const { data: journalpost } = useJournalpost();
  const { mulighet, fromJournalpost } = useMulighet();
  const additionalKabalMulighet = useAdditionalKabalMulighet();

  if (journalpost === undefined || mulighet === undefined || fromJournalpost) {
    return null;
  }

  return {
    fromId: journalpost.sak?.saksnummer ?? null,
    toId: additionalKabalMulighet?.saksnummer ?? mulighet.saksnummer,
  };
};
