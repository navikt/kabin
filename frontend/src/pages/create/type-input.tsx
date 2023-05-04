import { DocPencilIcon, TasklistStartIcon } from '@navikt/aksel-icons';
import { Alert, ToggleGroup } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { CardLarge, CardSmall } from '@app/components/card/card';
import { Ankemuligheter } from '@app/components/muligheter/anke/ankemuligheter';
import { Klagemuligheter } from '@app/components/muligheter/klage/klagemuligheter';
import { Overstyringer } from '@app/components/overstyringer/overstyringer';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { ApiContext } from './api-context/api-context';
import { isType } from './api-context/helpers';
import { Type } from './api-context/types';

export const TypeSelect = () => {
  const { type, setType, journalpost } = useContext(ApiContext);

  const onChange = useCallback((v: string) => setType((e) => (isType(v) ? v : e)), [setType]);

  if (journalpost === null) {
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
      <ToggleGroup onChange={onChange} value={type} size="small">
        <ToggleGroup.Item value={Type.KLAGE}>Klage</ToggleGroup.Item>
        <ToggleGroup.Item value={Type.ANKE}>Anke</ToggleGroup.Item>
      </ToggleGroup>
    </Row>
  );
};

export const TypeInput = () => {
  const { type } = useContext(ApiContext);

  if (type === Type.ANKE) {
    return (
      <>
        <Ankemuligheter />
        <Overstyringer title="Tilpass anken" klagerLabel="Ankende part" />
      </>
    );
  }

  if (type === Type.KLAGE) {
    return (
      <>
        <Klagemuligheter />
        <Overstyringer title="Tilpass klagen" klagerLabel="Klager" />
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 42px;
  flex-shrink: 0;
`;
