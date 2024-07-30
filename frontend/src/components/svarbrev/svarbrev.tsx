import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { Alert, Loader, ToggleGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useCallback } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { getSvarbrevSettings } from '@app/components/edit-frist/get-svarbrev-settings';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { getSuggestedBrevmottakere } from '@app/components/svarbrev/get-suggested-part-recipients';
import { InternalSvarbrevInput } from '@app/components/svarbrev/input';
import { PartRecipient } from '@app/components/svarbrev/types';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useGetPartWithUtsendingskanalQuery } from '@app/redux/api/part';
import { Overstyringer, Svarbrev } from '@app/redux/api/registrering';
import { useSetSvarbrevSendMutation } from '@app/redux/api/svarbrev';
import { useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { SvarbrevSetting } from '@app/types/svarbrev-settings';

enum SvarbrevOptionEnum {
  SEND = 'SEND',
  DONT_SEND = 'DONT_SEND',
}

export const SvarbrevInput = () => {
  // const { type, state, updateState, journalpost } = useContext(AppContext);
  // const type = useAppStateStore((state) => state.type);
  // const journalpost = useAppStateStore((state) => state.journalpost);
  // const ytelseId = useOverstyringerStore((state) => state.ytelseId);
  // const mulighet = useAppStateStore((state) => state.mulighet);
  // const sendSvarbrev = useAppStateStore((state) => state.sendSvarbrev);
  const registrering = useRegistrering();
  const { data: svarbrevSettings } = useSvarbrevSettings(registrering?.overstyringer.ytelseId ?? skipToken);
  const { data: sakenGjelder } = useGetPartWithUtsendingskanalQuery(registrering?.sakenGjelderValue ?? skipToken);

  if (registrering === undefined || sakenGjelder === undefined) {
    return <Loader title="Laster..." />;
  }

  if (registrering.typeId === null) {
    return null;
  }

  if (typeof registrering.overstyringer.ytelseId !== 'string') {
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

  const setting = getSvarbrevSettings(svarbrevSettings, registrering.typeId);

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

  const suggestedRecipients = getSuggestedBrevmottakere({
    fullmektig: registrering.overstyringer.fullmektig,
    klager: registrering.overstyringer.klager,
    receivers: registrering.svarbrev.receivers,
    sakenGjelder,
  });

  return (
    <LoadedSvarbrevInput
      sendSvarbrev={registrering.svarbrev.send}
      svarbrev={registrering.svarbrev}
      // journalpost={journalpost}
      // mulighet={registrering.mulighet}
      overstyringer={registrering.overstyringer}
      // updateState={updateState}
      suggestedRecipients={suggestedRecipients}
      setting={setting}
    />
  );
};

interface LoadedProps {
  sendSvarbrev: boolean;
  svarbrev: Svarbrev;
  // journalpost: IArkivertDocument;
  // mulighet: Mulighet;
  overstyringer: Overstyringer;
  // updateState: UpdateFn<IKlageStateUpdate, IKlageState> | UpdateFn<IAnkeStateUpdate, IAnkeState>;
  suggestedRecipients: PartRecipient[];
  setting: SvarbrevSetting;
}

const LoadedSvarbrevInput = ({
  sendSvarbrev,
  svarbrev,
  // journalpost,
  // mulighet,
  // overstyringer,
  // updateState,
  suggestedRecipients,
  setting,
}: LoadedProps) => {
  const [setSend] = useSetSvarbrevSendMutation();
  // const isInitialized = useRef(false);

  // useEffect(() => {
  //   if (isInitialized.current) {
  //     return;
  //   }

  //   isInitialized.current = true;

  //   updateState({
  //     sendSvarbrev: setting.shouldSend,
  //     svarbrev: {
  //       varsletBehandlingstidUnits: setting.behandlingstidUnits,
  //       varsletBehandlingstidUnitTypeId: setting.behandlingstidUnitTypeId,
  //       customText: setting.customText,
  //     },
  //   });
  // }, [setting, updateState]);

  const id = useRegistreringId();

  const onToggleChange = useCallback(
    // (value: string) => updateState({ sendSvarbrev: value === SvarbrevOptionEnum.SEND }),
    (value: string) => setSend({ send: value === SvarbrevOptionEnum.SEND, id }),
    [id, setSend],
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
          // mulighet={mulighet}
          // overstyringer={overstyringer}
          // journalpostId={journalpost.journalpostId}
          suggestedRecipients={suggestedRecipients}
          // updateState={updateState}
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
