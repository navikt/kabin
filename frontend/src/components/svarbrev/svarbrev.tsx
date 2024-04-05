import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { Alert, ToggleGroup } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { getSuggestedBrevmottakere } from '@app/components/svarbrev/get-suggested-part-recipients';
import { InternalSvarbrevInput } from '@app/components/svarbrev/input';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';

enum SvarbrevOptionEnum {
  SEND = 'SEND',
  DONT_SEND = 'DONT_SEND',
}

export const SvarbrevInput = () => {
  const { type, state, updateState, journalpost } = useContext(AppContext);

  if (type !== Type.ANKE || state.mulighet === null || journalpost === null || state.overstyringer.ytelseId === null) {
    return (
      <>
        <Row>
          <Alert variant="info" size="small" inline>
            Velg ytelse
          </Alert>
        </Row>
        <Card title="Svarbrev">
          <Placeholder>
            <EnvelopeOpenIcon aria-hidden />
          </Placeholder>
        </Card>
      </>
    );
  }

  const suggestedRecipients = getSuggestedBrevmottakere(state);

  const { sendSvarbrev, svarbrev } = state;

  const onToggleChange = (value: string) => updateState({ sendSvarbrev: value === SvarbrevOptionEnum.SEND });

  return (
    <>
      <ToggleContainer>
        <ToggleGroup
          size="small"
          value={sendSvarbrev ? SvarbrevOptionEnum.SEND : SvarbrevOptionEnum.DONT_SEND}
          onChange={onToggleChange}
        >
          <ToggleGroup.Item value={SvarbrevOptionEnum.SEND}>Send svarbrev</ToggleGroup.Item>
          <ToggleGroup.Item value={SvarbrevOptionEnum.DONT_SEND}>Ikke send svarbrev</ToggleGroup.Item>
        </ToggleGroup>
      </ToggleContainer>
      {sendSvarbrev ? (
        <InternalSvarbrevInput
          svarbrev={svarbrev}
          mulighet={state.mulighet}
          overstyringer={state.overstyringer}
          journalpostId={journalpost.journalpostId}
          suggestedRecipients={suggestedRecipients}
          updateState={updateState}
        />
      ) : null}
    </>
  );
};

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 42px;
  flex-shrink: 0;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 42px;
  flex-shrink: 0;
`;
