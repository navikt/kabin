import { TasklistStartIcon } from '@navikt/aksel-icons';
import { ToggleGroup } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { Card } from '@app/components/card/card';
import { Ankemuligheter } from '@app/components/muligheter/anke/ankemuligheter';
import { Klagemuligheter } from '@app/components/muligheter/klage/klagemuligheter';
import { Overstyringer } from '@app/components/overstyringer/overstyringer';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { ApiContext } from './api-context/api-context';
import { isType } from './api-context/helpers';
import { Type } from './api-context/types';

export const TypeInput = () => {
  const { type, setType } = useContext(ApiContext);

  const onChange = useCallback((v: string) => setType((e) => (isType(v) ? v : e)), [setType]);

  return (
    <>
      <Row>
        <ToggleGroup onChange={onChange} value={type} size="small">
          <ToggleGroup.Item value={Type.KLAGE}>Klage</ToggleGroup.Item>
          <ToggleGroup.Item value={Type.ANKE}>Anke</ToggleGroup.Item>
        </ToggleGroup>
      </Row>
      <RenderTypeInput />
    </>
  );
};

const RenderTypeInput = () => {
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
        <Overstyringer title="Tilpass klagen" klagerLabel="Klagende part" />
      </>
    );
  }

  return (
    <Card>
      <Placeholder>
        <TasklistStartIcon />
      </Placeholder>
    </Card>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
