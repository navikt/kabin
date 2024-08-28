import { Card } from '@app/components/card/card';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { InternalSvarbrevInput } from '@app/components/svarbrev/input';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useGetSvarbrevSettingQuery } from '@app/redux/api/svarbrev-settings';
import { useSetSvarbrevSendMutation } from '@app/redux/api/svarbrev/svarbrev';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { Alert, Loader, ToggleGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { styled } from 'styled-components';

enum SvarbrevOptionEnum {
  SEND = 'SEND',
  DONT_SEND = 'DONT_SEND',
}

const SendSvarbrevToggle = () => {
  const { svarbrev } = useRegistrering();
  const [setSend] = useSetSvarbrevSendMutation();
  const id = useRegistreringId();
  const canEdit = useCanEdit();

  if (!canEdit) {
    return svarbrev.send === true ? null : (
      <Row>
        <Alert variant="info" size="small" inline>
          Svarbrev sendes ikke
        </Alert>
      </Row>
    );
  }

  return (
    <ToggleContainer>
      <ToggleGroup
        size="small"
        value={svarbrev.send === true ? SvarbrevOptionEnum.SEND : SvarbrevOptionEnum.DONT_SEND}
        onChange={(value) => setSend({ send: value === SvarbrevOptionEnum.SEND, id })}
      >
        <ToggleGroup.Item value={SvarbrevOptionEnum.SEND}>Send svarbrev</ToggleGroup.Item>
        <ToggleGroup.Item value={SvarbrevOptionEnum.DONT_SEND}>Ikke send svarbrev</ToggleGroup.Item>
      </ToggleGroup>
    </ToggleContainer>
  );
};

export const Svarbrev = () => (
  <>
    <SendSvarbrevToggle />
    <SvarbrevInput />
  </>
);

const SvarbrevInput = () => {
  const { typeId, svarbrev, mulighet } = useRegistrering();
  const ytelseId = useYtelseId();
  const { data: svarbrevSetting } = useGetSvarbrevSettingQuery(
    typeId === null || ytelseId === null ? skipToken : { ytelseId, typeId },
  );

  if (typeId === null || svarbrev.send !== true) {
    return null;
  }

  if (mulighet === null) {
    return (
      <Card title="Svarbrev">
        <Placeholder>
          <EnvelopeOpenIcon aria-hidden />
        </Placeholder>
      </Card>
    );
  }

  if (ytelseId === null) {
    return (
      <Row>
        <Alert variant="info" size="small" inline>
          Velg ytelse
        </Alert>
      </Row>
    );
  }

  if (svarbrevSetting === undefined) {
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

  if (svarbrev.send !== true) {
    return null;
  }

  return <InternalSvarbrevInput setting={svarbrevSetting} />;
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
