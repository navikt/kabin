import { DocPencilIcon, TasklistStartIcon } from '@navikt/aksel-icons';
import { Alert, Tag, ToggleGroup } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';
import { CardLarge, CardSmall } from '@app/components/card/card';
import { Ankemuligheter } from '@app/components/muligheter/anke/ankemuligheter';
import { Klagemuligheter } from '@app/components/muligheter/klage/klagemuligheter';
import { Oppgaver } from '@app/components/oppgaver/oppgaver';
import { Overstyringer } from '@app/components/overstyringer/overstyringer';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { Svarbrev } from '@app/components/svarbrev/svarbrev';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetTypeMutation } from '@app/redux/api/registreringer/mutations';
import { RegistreringType, SaksTypeEnum, isType } from '@app/types/common';

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
  const [setType] = useSetTypeMutation();
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
        <Svarbrev />
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
        <Svarbrev />
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
