import { DocPencilIcon, TasklistStartIcon } from '@navikt/aksel-icons';
import { Alert, ToggleGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useCallback, useMemo } from 'react';
import { styled } from 'styled-components';
import { CardLarge, CardSmall } from '@app/components/card/card';
import { Ankemuligheter } from '@app/components/muligheter/anke/ankemuligheter';
import { Klagemuligheter } from '@app/components/muligheter/klage/klagemuligheter';
import { Oppgaver } from '@app/components/oppgaver/oppgaver';
import { Overstyringer } from '@app/components/overstyringer/overstyringer';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SvarbrevInput } from '@app/components/svarbrev/svarbrev';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetTypeMutation } from '@app/redux/api/registrering';
import { WillCreateNewJournalpostInput } from '@app/simple-api-state/types';
import { useWillCreateNewJournalpost } from '@app/simple-api-state/use-api';
import { SaksTypeEnum } from '@app/types/common';
import { isType } from './app-context/helpers';

export const TypeSelect = () => {
  const registrering = useRegistrering();
  const [setType] = useSetTypeMutation();

  const onChange = useCallback(
    (typeId: string) => {
      if (!isType(typeId)) {
        return;
      }

      setType({ id: registrering.id, typeId });
    },
    [registrering.id, setType],
  );

  if (registrering === undefined || registrering.journalpostId === null) {
    return (
      <Row>
        <Alert variant="info" size="small" inline>
          Velg journalpost.
        </Alert>
      </Row>
    );
  }

  return (
    <Row>
      <ToggleGroup onChange={onChange} value={registrering.typeId ?? undefined} size="small">
        <ToggleGroup.Item value={SaksTypeEnum.KLAGE}>Klage</ToggleGroup.Item>
        <ToggleGroup.Item value={SaksTypeEnum.ANKE}>Anke</ToggleGroup.Item>
      </ToggleGroup>
    </Row>
  );
};

export const TypeInput = () => {
  const registrering = useRegistrering();

  if (registrering?.typeId === SaksTypeEnum.ANKE) {
    return (
      <>
        <Ankemuligheter />
        <WillCreateNewJournalpostInfo />
        <Oppgaver />
        <Overstyringer title="Tilpass anken" klagerLabel="Ankende part" />
        <SvarbrevInput />
      </>
    );
  }

  if (registrering?.typeId === SaksTypeEnum.KLAGE) {
    return (
      <>
        <Klagemuligheter />
        <WillCreateNewJournalpostInfo />
        <Oppgaver />
        <Overstyringer title="Tilpass klagen" klagerLabel="Klager" />
        <SvarbrevInput />
      </>
    );
  }

  return (
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
};

const WillCreateNewJournalpostInfo = () => {
  const journalpostAndMulighet = useJournalpostAndMulighet();

  const params = useMemo<WillCreateNewJournalpostInput | typeof skipToken>(() => {
    if (journalpostAndMulighet === null) {
      return skipToken;
    }

    const { journalpost, mulighet } = journalpostAndMulighet;
    const { fagsakId, fagsystemId } = mulighet;
    const { journalpostId } = journalpost;

    return { journalpostId, fagsakId, fagsystemId };
  }, [journalpostAndMulighet]);

  const { data: willCreateNewJournalpost } = useWillCreateNewJournalpost(params);

  if (willCreateNewJournalpost !== true || journalpostAndMulighet === null) {
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
  const { data: journalpost } = useJournalpost();
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
