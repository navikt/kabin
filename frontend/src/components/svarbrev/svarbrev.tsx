import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { Alert, Loader, ToggleGroup } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { getSvarbrevSettings } from '@app/components/edit-frist/get-svarbrev-settings';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { getSuggestedBrevmottakere } from '@app/components/svarbrev/get-suggested-part-recipients';
import { InternalSvarbrevInput } from '@app/components/svarbrev/input';
import { PartRecipient } from '@app/components/svarbrev/types';
import { AppContext } from '@app/pages/create/app-context/app-context';
import {
  IAnkeOverstyringer,
  IAnkeState,
  IAnkeStateUpdate,
  IKlageOverstyringer,
  IKlageState,
  IKlageStateUpdate,
  Svarbrev,
  Type,
  UpdateFn,
} from '@app/pages/create/app-context/types';
import { useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { IArkivertDocument } from '@app/types/dokument';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { SvarbrevSetting } from '@app/types/svarbrev-settings';

enum SvarbrevOptionEnum {
  SEND = 'SEND',
  DONT_SEND = 'DONT_SEND',
}

export const SvarbrevInput = () => {
  const { type, state, updateState, journalpost } = useContext(AppContext);
  const { data } = useSvarbrevSettings(state?.overstyringer.ytelseId ?? skipToken);

  if (type === Type.NONE) {
    return null;
  }

  if (state.mulighet === null || journalpost === null || state.overstyringer.ytelseId === null) {
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

  const setting = getSvarbrevSettings(data, type);

  if (setting === null) {
    return (
      <>
        <Row>
          <Loader size="small" />
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

  return (
    <LoadedSvarbrevInput
      sendSvarbrev={state.sendSvarbrev}
      svarbrev={state.svarbrev}
      journalpost={journalpost}
      mulighet={state.mulighet}
      overstyringer={state.overstyringer}
      updateState={updateState}
      suggestedRecipients={suggestedRecipients}
      setting={setting}
    />
  );
};

interface LoadedProps {
  sendSvarbrev: boolean;
  svarbrev: Svarbrev;
  journalpost: IArkivertDocument;
  mulighet: IAnkeMulighet | IKlagemulighet;
  overstyringer: IAnkeOverstyringer | IKlageOverstyringer;
  updateState: UpdateFn<IKlageStateUpdate, IKlageState> | UpdateFn<IAnkeStateUpdate, IAnkeState>;
  suggestedRecipients: PartRecipient[];
  setting: SvarbrevSetting;
}

const LoadedSvarbrevInput = ({
  sendSvarbrev,
  svarbrev,
  journalpost,
  mulighet,
  overstyringer,
  updateState,
  suggestedRecipients,
  setting,
}: LoadedProps) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    updateState({
      sendSvarbrev: setting.shouldSend,
      svarbrev: {
        varsletBehandlingstidUnits: setting.behandlingstidUnits,
        varsletBehandlingstidUnitType: setting.behandlingstidUnitType,
        customText: setting.customText,
      },
    });
  }, [setting, updateState]);

  const onToggleChange = useCallback(
    (value: string) => updateState({ sendSvarbrev: value === SvarbrevOptionEnum.SEND }),
    [updateState],
  );

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
          mulighet={mulighet}
          overstyringer={overstyringer}
          journalpostId={journalpost.journalpostId}
          suggestedRecipients={suggestedRecipients}
          updateState={updateState}
          setting={setting}
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
