import { TextField } from '@navikt/ds-react';
import { useEffect } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { EditVarsletFrist } from '@app/components/svarbrev/edit-varslet-frist';
import { Preview } from '@app/components/svarbrev/preview/preview';
import { Receipients } from '@app/components/svarbrev/recipients';
import { PartRecipient } from '@app/components/svarbrev/types';
import { defaultString } from '@app/functions/empty-string';
import { useOverstyringerStore, useSvarbrevStore } from '@app/pages/create/app-context/state';
import {
  DEFAULT_SVARBREV_NAME,
  IAnkeOverstyringer,
  IAnkeState,
  IAnkeStateUpdate,
  IKlageOverstyringer,
  IKlageState,
  IKlageStateUpdate,
  Svarbrev,
  UpdateFn,
} from '@app/pages/create/app-context/types';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { SvarbrevSetting } from '@app/types/svarbrev-settings';

interface Props {
  mulighet: IAnkeMulighet | IKlagemulighet;
  overstyringer: IAnkeOverstyringer | IKlageOverstyringer;
  svarbrev: Svarbrev;
  journalpostId: string;
  suggestedRecipients: PartRecipient[];
  updateState: UpdateFn<IKlageStateUpdate, IKlageState> | UpdateFn<IAnkeStateUpdate, IAnkeState>;
  setting: SvarbrevSetting;
}

export const InternalSvarbrevInput = ({ svarbrev, suggestedRecipients, updateState, setting }: Props) => {
  const fullmektig = useOverstyringerStore((state) => state.fullmektig);
  const setTitle = useSvarbrevStore((state) => state.setTitle);
  const setFullmektigFritekst = useSvarbrevStore((state) => state.setFullmektigFritekst);
  const setReceivers = useSvarbrevStore((state) => state.setReceivers);

  useEffect(() => {
    // Automatically add suggested recipients if there is only one and no recipients are added.
    if (suggestedRecipients.length === 1 && svarbrev.receivers.length === 0) {
      setReceivers(suggestedRecipients);
    }
  }, [setReceivers, suggestedRecipients, svarbrev.receivers]);

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
            onBlur={({ target }) => setTitle(defaultString(target.value, DEFAULT_SVARBREV_NAME))}
            onChange={({ target }) => setTitle(target.value)}
          />

          <StyledTextField
            label="Navn på fullmektig i brevet"
            htmlSize={45}
            size="small"
            placeholder={fullmektig?.name ?? undefined}
            value={svarbrev.fullmektigFritekst ?? fullmektig?.name ?? ''}
            onBlur={({ target }) => setFullmektigFritekst(defaultString(target.value, fullmektig?.name ?? null))}
            onChange={({ target }) => setFullmektigFritekst(target.value)}
            autoComplete="off"
          />
        </Row>

        <EditVarsletFrist setting={setting} onChange={(s) => updateState({ svarbrev: s })} />

        <Content>
          <Receipients
            recipients={svarbrev.receivers}
            setRecipients={(receivers) => setReceivers(receivers)}
            suggestedRecipients={suggestedRecipients}
          />
        </Content>
      </Card>

      <Card title="Forhåndsvisning av svarbrev">
        <Preview />
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
