import { TextField, ToggleGroup } from '@navikt/ds-react';
import React, { useCallback, useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { getSuggestedBrevmottakere } from '@app/components/svarbrev/get-suggested-part-recipients';
import { Preview } from '@app/components/svarbrev/preview/preview';
import { Receipients } from '@app/components/svarbrev/recipients';
import { PartRecipient } from '@app/components/svarbrev/types';
import { defaultString } from '@app/functions/empty-string';
import { AppContext } from '@app/pages/create/app-context/app-context';
import {
  DEFAULT_SVARBREV_NAME,
  IAnkeOverstyringer,
  IAnkeState,
  Svarbrev,
  Type,
} from '@app/pages/create/app-context/types';
import { IAnkeMulighet } from '@app/types/mulighet';

export const SvarbrevInput = () => {
  const { type, state, updateState, journalpost } = useContext(AppContext);

  if (type !== Type.ANKE || state.mulighet === null || journalpost === null) {
    return null;
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

interface Props {
  mulighet: IAnkeMulighet;
  overstyringer: IAnkeOverstyringer;
  svarbrev: Svarbrev;
  journalpostId: string;
  suggestedRecipients: PartRecipient[];
  updateState: (state: Partial<IAnkeState>) => void;
}

enum SvarbrevOptionEnum {
  SEND = 'SEND',
  DONT_SEND = 'DONT_SEND',
}

const InternalSvarbrevInput = ({
  svarbrev,
  mulighet,
  overstyringer,
  journalpostId,
  suggestedRecipients,
  updateState,
}: Props) => {
  const updateSvarbrev = useCallback(
    (update: Partial<Svarbrev>) => updateState({ svarbrev: { ...svarbrev, ...update } }),
    [svarbrev, updateState],
  );

  useEffect(() => {
    // Automatically add suggested recipients if there is only one and no recipients are added.
    if (suggestedRecipients.length === 1 && svarbrev.receivers.length === 0) {
      updateSvarbrev({ receivers: suggestedRecipients });
    }
  }, [suggestedRecipients, svarbrev.receivers, updateSvarbrev]);

  return (
    <>
      <Card title="Svarbrev">
        <Row>
          <TextField
            label="Dokumentnavn"
            htmlSize={45}
            size="small"
            placeholder={DEFAULT_SVARBREV_NAME}
            value={svarbrev.title}
            onBlur={({ target }) => updateSvarbrev({ title: defaultString(target.value, DEFAULT_SVARBREV_NAME) })}
            onChange={({ target }) => updateSvarbrev({ title: target.value })}
          />
          <TextField
            label="Navn på fullmektig i brevet"
            htmlSize={45}
            size="small"
            placeholder={overstyringer.fullmektig?.name ?? undefined}
            value={svarbrev.fullmektigFritekst ?? overstyringer.fullmektig?.name ?? ''}
            onBlur={({ target }) =>
              updateSvarbrev({
                fullmektigFritekst: defaultString(target.value, overstyringer.fullmektig?.name ?? null),
              })
            }
            onChange={({ target }) => updateSvarbrev({ fullmektigFritekst: target.value })}
            autoComplete="off"
          />
        </Row>
        <Content>
          <Receipients
            recipients={svarbrev.receivers}
            setRecipients={(receivers) => updateSvarbrev({ receivers })}
            suggestedRecipients={suggestedRecipients}
          />
        </Content>
      </Card>
      <Card title="Forhåndsvisning av svarbrev">
        <Preview mulighet={mulighet} overstyringer={overstyringer} svarbrev={svarbrev} journalpostId={journalpostId} />
      </Card>
    </>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  justify-content: space-between;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;
