import { CardLarge, CardSmall } from '@app/components/card/card';
import { GosysOppgaver } from '@app/components/gosys-oppgaver/gosys-oppgaver';
import { LoadingGosysOppgaver } from '@app/components/gosys-oppgaver/loading-gosys-oppgaver';
import { LoadingOverstyringer, LoadingSvarbrev } from '@app/components/loading-registrering/loading-registrering';
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
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import {
  useSetMulighetIsBasedOnJournalpostMutation,
  useSetTypeMutation,
} from '@app/redux/api/registreringer/mutations';
import { isType, SaksTypeEnum } from '@app/types/common';
import { DocPencilIcon, TasklistStartIcon } from '@navikt/aksel-icons';
import { Alert, Checkbox, HStack, Stack, Tag, ToggleGroup } from '@navikt/ds-react';
import { type ChangeEventHandler, useCallback } from 'react';

const ReadOnlyType = () => {
  const { typeId, mulighetIsBasedOnJournalpost } = useRegistrering();

  switch (typeId) {
    case SaksTypeEnum.ANKE:
      return (
        <Tag data-color="meta-purple" variant="outline" size="medium">
          Anke
        </Tag>
      );
    case SaksTypeEnum.KLAGE:
      return (
        <Tag data-color="info" variant="outline" size="medium">
          Klage
        </Tag>
      );
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return (
        <Tag data-color="info" variant="outline" size="medium">
          Omgjøringskrav{mulighetIsBasedOnJournalpost ? ' fra journalpost' : null}
        </Tag>
      );
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return (
        <Tag data-color="info" variant="outline" size="medium">
          Begjæring om gjenopptak{mulighetIsBasedOnJournalpost ? ' fra journalpost' : null}
        </Tag>
      );
    case null:
      return (
        <Tag data-color="info" variant="outline" size="medium">
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
      <Stack justify="center">
        <ReadOnlyType />
      </Stack>
    );
  }

  if (journalpostId === null) {
    return (
      <Stack justify="center">
        <Alert variant="info" size="small" inline>
          Velg journalpost.
        </Alert>
      </Stack>
    );
  }

  const value = typeId ?? undefined;

  // Without `key` TogglegGroup will remember last non-undefined value when undefined.
  return (
    <HStack gap="space-16" justify="center" align="center">
      <ToggleGroup onChange={onChange} value={value ?? 'none'} size="small" key={value === undefined ? 'none' : 'some'}>
        <ToggleGroup.Item value={SaksTypeEnum.KLAGE}>Klage</ToggleGroup.Item>
        <ToggleGroup.Item value={SaksTypeEnum.ANKE}>Anke</ToggleGroup.Item>
        <ToggleGroup.Item value={SaksTypeEnum.OMGJØRINGSKRAV}>Omgjøringskrav</ToggleGroup.Item>
        <ToggleGroup.Item value={SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK}>Begjæring om gjenopptak</ToggleGroup.Item>
      </ToggleGroup>
      {value === SaksTypeEnum.OMGJØRINGSKRAV || value === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK ? (
        <FraJournalpostCheckbox />
      ) : null}
    </HStack>
  );
};

const FraJournalpostCheckbox = () => {
  const { mulighetIsBasedOnJournalpost, id } = useRegistrering();
  const [setMulighetBasedOnJournalpost, { isLoading }] = useSetMulighetIsBasedOnJournalpostMutation();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (mulighetIsBasedOnJournalpost === event.target.checked) {
      return;
    }

    setMulighetBasedOnJournalpost({ mulighetIsBasedOnJournalpost: event.target.checked, id });
  };

  return (
    <Checkbox checked={mulighetIsBasedOnJournalpost} onChange={onChange} disabled={isLoading}>
      Fra journalpost
    </Checkbox>
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
    return (
      <>
        <Ankemuligheter />
        <WillCreateNewJournalpostInfo />
        <GosysOppgaver />
        <Overstyringer title="Tilpass anken" klagerLabel={klagerLabel} saksbehandlerFromMulighetLabel="Fra klagen" />
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
        <Overstyringer title="Tilpass klagen" klagerLabel={klagerLabel} saksbehandlerFromMulighetLabel="Fra klagen" />
        <Svarbrev />
      </>
    );
  }

  if (typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return mulighetIsBasedOnJournalpost ? (
      <>
        <Journalpostmuligheter title="Velg vedtaket som omgjøringskravet gjelder" />
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
        <Journalpostmuligheter title="Velg kjennelsen som begjæringen om gjenopptak gjelder" />
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
  const { mulighet, fromJournalpost } = useMulighet();

  if (journalpost === undefined || mulighet === undefined || fromJournalpost) {
    return null;
  }

  return { journalpost, mulighet };
};
