import { TextField } from '@navikt/ds-react';
import React, { useCallback, useEffect } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { Preview } from '@app/components/svarbrev/preview/preview';
import { Receipients } from '@app/components/svarbrev/recipients';
import { PartRecipient } from '@app/components/svarbrev/types';
import { defaultString } from '@app/functions/empty-string';
import { DEFAULT_SVARBREV_NAME, IAnkeOverstyringer, IAnkeState, Svarbrev } from '@app/pages/create/app-context/types';
import { IAnkeMulighet } from '@app/types/mulighet';

interface Props {
  mulighet: IAnkeMulighet;
  overstyringer: IAnkeOverstyringer;
  svarbrev: Svarbrev;
  journalpostId: string;
  suggestedRecipients: PartRecipient[];
  updateState: (state: Partial<IAnkeState>) => void;
}

export const InternalSvarbrevInput = ({
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
          <StyledTextField
            label="Dokumentnavn"
            htmlSize={45}
            size="small"
            placeholder={DEFAULT_SVARBREV_NAME}
            value={svarbrev.title}
            onBlur={({ target }) => updateSvarbrev({ title: defaultString(target.value, DEFAULT_SVARBREV_NAME) })}
            onChange={({ target }) => updateSvarbrev({ title: target.value })}
          />
          <StyledTextField
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

const StyledTextField = styled(TextField)`
  width: 100%;

  && > input {
    width: 100%;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 8px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;
