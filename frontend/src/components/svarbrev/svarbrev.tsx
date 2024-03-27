import { Alert, Select, TextField, ToggleGroup } from '@navikt/ds-react';
import React, { useCallback, useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { CardLarge } from '@app/components/card/card';
import { getSuggestedBrevmottakere } from '@app/components/svarbrev/get-suggested-part-recipients';
import { Preview } from '@app/components/svarbrev/preview/preview';
import { Receipients } from '@app/components/svarbrev/recipients';
import { PartRecipient } from '@app/components/svarbrev/types';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { getValidSvarbrev } from '@app/pages/create/api-context/helpers';
import { IAnkeOverstyringer, IAnkeState, Svarbrev, Type } from '@app/pages/create/api-context/types';
import { useInnsendingsenheter } from '@app/simple-api-state/use-kodeverk';
import { IAnkeMulighet } from '@app/types/mulighet';

export const SvarbrevInput = () => {
  const { type, payload, updatePayload, journalpost } = useContext(ApiContext);

  if (type !== Type.ANKE || payload.mulighet === null || journalpost === null) {
    return null;
  }

  const suggestedRecipients = getSuggestedBrevmottakere(payload);

  const { sendSvarbrev, svarbrev } = payload;

  const onToggleChange = (value: string) => updatePayload({ sendSvarbrev: value === SvarbrevOptionEnum.SEND });

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
          mulighet={payload.mulighet}
          overstyringer={payload.overstyringer}
          journalpostId={journalpost.journalpostId}
          suggestedRecipients={suggestedRecipients}
          updatePayload={updatePayload}
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
  updatePayload: (p: Partial<IAnkeState>) => void;
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
  updatePayload,
}: Props) => {
  const { data: enheter } = useInnsendingsenheter();

  const updateSvarbrev = useCallback(
    (update: Partial<Svarbrev>) => updatePayload({ svarbrev: { ...svarbrev, ...update } }),
    [svarbrev, updatePayload],
  );

  useEffect(() => {
    // Automatically add suggested recipients if there is only one and no recipients are added.
    if (suggestedRecipients.length === 1 && svarbrev.receivers.length === 0) {
      updateSvarbrev({ receivers: suggestedRecipients });
    }
  }, [suggestedRecipients, svarbrev.receivers, updateSvarbrev]);

  return (
    <>
      <CardLarge title="Svarbrev">
        <Row>
          <TextField
            label="Dokumentnavn"
            htmlSize={45}
            size="small"
            value={svarbrev.title}
            onChange={({ target }) => updateSvarbrev({ title: target.value })}
          />
          <TextField
            label="Navn på fullmektig i brevet"
            htmlSize={45}
            size="small"
            value={svarbrev.fullmektigFritekst ?? overstyringer.fullmektig?.name ?? ''}
            onChange={({ target }) => updateSvarbrev({ fullmektigFritekst: target.value })}
          />
          <Select
            label="Enhet"
            size="small"
            value={svarbrev.enhetId ?? NONE}
            onChange={({ target }) => updateSvarbrev({ enhetId: target.value })}
          >
            {svarbrev.enhetId === null ? <option value={NONE}>Velg enhet</option> : null}
            {enheter?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.navn}
              </option>
            ))}
          </Select>
        </Row>
        <Content>
          <Receipients
            recipients={svarbrev.receivers}
            setRecipients={(receivers) => updateSvarbrev({ receivers })}
            suggestedRecipients={suggestedRecipients}
          />
        </Content>
      </CardLarge>
      <CardLarge title="Svarbrev forhåndsvisning">
        {svarbrev !== null && getValidSvarbrev(svarbrev) ? (
          <Preview
            mulighet={mulighet}
            overstyringer={overstyringer}
            svarbrev={svarbrev}
            journalpostId={journalpostId}
          />
        ) : (
          <Alert variant="info" size="small">
            Velg enhet for å se forhåndsvisning.
          </Alert>
        )}
      </CardLarge>
    </>
  );
};

const NONE = 'NONE';

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
