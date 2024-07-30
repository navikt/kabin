import { TextField } from '@navikt/ds-react';
import { useEffect } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { EditVarsletFrist } from '@app/components/svarbrev/edit-varslet-frist';
import { Preview } from '@app/components/svarbrev/preview/preview';
import { Receipients } from '@app/components/svarbrev/recipients';
import { PartRecipient } from '@app/components/svarbrev/types';
import { defaultString } from '@app/functions/empty-string';
import { useRegistrering } from '@app/hooks/use-registrering';
import { DEFAULT_SVARBREV_NAME } from '@app/pages/create/app-context/types';
import { Svarbrev } from '@app/redux/api/registrering';
import {
  useSetSvarbrevFullmektigFritekstMutation,
  useSetSvarbrevReceiversMutation,
  useSetSvarbrevTitleMutation,
} from '@app/redux/api/svarbrev';
import { SvarbrevSetting } from '@app/types/svarbrev-settings';

interface Props {
  // mulighet: Mulighet;
  // overstyringer: Overstyringer;
  svarbrev: Svarbrev;
  // journalpostId: string;
  suggestedRecipients: PartRecipient[];
  // updateState: UpdateFn<IKlageStateUpdate, IKlageState> | UpdateFn<IAnkeStateUpdate, IAnkeState>;
  setting: SvarbrevSetting;
}

export const InternalSvarbrevInput = ({ svarbrev, suggestedRecipients, setting }: Props) => {
  const { id, overstyringer } = useRegistrering();
  const { fullmektig } = overstyringer;
  const [setTitle] = useSetSvarbrevTitleMutation();
  const [setFullmektigFritekst] = useSetSvarbrevFullmektigFritekstMutation();
  const [setReceivers] = useSetSvarbrevReceiversMutation();

  useEffect(() => {
    // Automatically add suggested recipients if there is only one and no recipients are added.
    if (suggestedRecipients.length === 1 && svarbrev.receivers.length === 0) {
      setReceivers({ id, receivers: suggestedRecipients });
    }
  }, [id, setReceivers, suggestedRecipients, svarbrev.receivers]);

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
            onBlur={({ target }) => setTitle({ id, title: defaultString(target.value, DEFAULT_SVARBREV_NAME) })}
            onChange={({ target }) => setTitle({ id, title: target.value })}
          />

          <StyledTextField
            label="Navn på fullmektig i brevet"
            htmlSize={45}
            size="small"
            placeholder={fullmektig?.name ?? undefined}
            value={svarbrev.fullmektigFritekst ?? fullmektig?.name ?? ''}
            onBlur={({ target }) =>
              setFullmektigFritekst({ id, fullmektigFritekst: defaultString(target.value, fullmektig?.name ?? null) })
            }
            onChange={({ target }) => setFullmektigFritekst({ id, fullmektigFritekst: target.value })}
            autoComplete="off"
          />
        </Row>

        {/* <EditVarsletFrist setting={setting} onChange={(s) => updateState({ svarbrev: s })} /> */}
        <EditVarsletFrist setting={setting} />

        <Content>
          <Receipients
            recipients={svarbrev.receivers}
            setRecipients={(receivers) => setReceivers({ id, receivers })}
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
