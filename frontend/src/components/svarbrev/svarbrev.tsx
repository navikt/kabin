import { Select, TextField, ToggleGroup } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { CardLarge } from '@app/components/card/card';
import { Receipients } from '@app/components/svarbrev/recipients';
import { useSuggestedBrevmottakere } from '@app/components/svarbrev/use-suggested-part-recipients';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { IAnkeState, Svarbrev, Type } from '@app/pages/create/api-context/types';
import { useInnsendingsenheter } from '@app/simple-api-state/use-kodeverk';

export const SvarbrevInput = () => {
  const { type, payload, updatePayload } = useContext(ApiContext);

  if (type !== Type.ANKE || payload.mulighet === null) {
    return null;
  }

  const { svarbrev } = payload;
  const shouldSendSvarbrev = svarbrev !== null;

  const onToggleChange = (value: string) =>
    updatePayload({ svarbrev: value === SvarbrevOptionEnum.DONT_SEND ? null : getInitialSvarbrevState(payload) });

  return (
    <>
      <Row>
        <ToggleGroup
          size="small"
          value={shouldSendSvarbrev ? SvarbrevOptionEnum.SEND : SvarbrevOptionEnum.DONT_SEND}
          onChange={onToggleChange}
        >
          <ToggleGroup.Item value={SvarbrevOptionEnum.SEND}>Send svarbrev</ToggleGroup.Item>
          <ToggleGroup.Item value={SvarbrevOptionEnum.DONT_SEND}>Ikke send svarbrev</ToggleGroup.Item>
        </ToggleGroup>
      </Row>
      {shouldSendSvarbrev ? (
        <InternalSvarbrevInput
          svarbrev={svarbrev}
          overstyringer={payload.overstyringer}
          updatePayload={updatePayload}
        />
      ) : null}
    </>
  );
};

const DEFAULT_SVARBREV_NAME = 'NAV orienterer om saksbehandlingen';

const getInitialSvarbrevState = (payload: IAnkeState): Svarbrev => ({
  fullmektigFritekst: payload.svarbrev?.fullmektigFritekst ?? payload?.overstyringer.fullmektig?.name ?? null,
  enhetId: payload.svarbrev?.enhetId ?? '',
  title: payload.svarbrev?.title ?? DEFAULT_SVARBREV_NAME,
  receivers: payload.svarbrev?.receivers ?? [],
});

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 42px;
  flex-shrink: 0;
`;

interface Props {
  overstyringer: IAnkeState['overstyringer'];
  svarbrev: Svarbrev;
  updatePayload: (p: Partial<IAnkeState>) => void;
}

enum SvarbrevOptionEnum {
  SEND = 'SEND',
  DONT_SEND = 'DONT_SEND',
}

const InternalSvarbrevInput = ({ svarbrev, overstyringer, updatePayload }: Props) => {
  const { data: enheter } = useInnsendingsenheter();
  const suggestedRecipients = useSuggestedBrevmottakere();

  return (
    <CardLarge title="Svarbrev">
      <Content>
        <TextField
          label="Navn på fullmektig i brevet"
          size="small"
          value={svarbrev.fullmektigFritekst ?? overstyringer.fullmektig?.name ?? ''}
          onChange={({ target }) => updatePayload({ svarbrev: { ...svarbrev, fullmektigFritekst: target.value } })}
        />
        <Select
          label="Enhet"
          size="small"
          value={svarbrev.enhetId}
          onChange={({ target }) => updatePayload({ svarbrev: { ...svarbrev, enhetId: target.value } })}
        >
          {enheter?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.navn}
            </option>
          ))}
        </Select>
        <Receipients
          recipients={svarbrev.receivers}
          setRecipients={(receivers) => updatePayload({ svarbrev: { ...svarbrev, receivers } })}
          suggestedRecipients={suggestedRecipients}
        />
      </Content>
    </CardLarge>
  );
};

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;
