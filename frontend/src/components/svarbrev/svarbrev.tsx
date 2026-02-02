import { Card } from '@app/components/card/card';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { InternalSvarbrevInput } from '@app/components/svarbrev/input';
import { VarsletFrist } from '@app/components/svarbrev/varslet-frist';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useSetSvarbrevSendMutation } from '@app/redux/api/svarbrev/svarbrev';
import { useGetSvarbrevSettingQuery } from '@app/redux/api/svarbrev-settings';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { Alert, HStack, Loader, ToggleGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';

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
      <HStack align="center" justify="center" height="42px" flexShrink="0">
        <Alert variant="info" size="small" inline>
          Svarbrev sendes ikke
        </Alert>
      </HStack>
    );
  }

  return (
    <HStack align="center" justify="center" height="42px" flexShrink="0">
      <ToggleGroup
        size="small"
        value={svarbrev.send === true ? SvarbrevOptionEnum.SEND : SvarbrevOptionEnum.DONT_SEND}
        onChange={(value) => setSend({ send: value === SvarbrevOptionEnum.SEND, id })}
      >
        <ToggleGroup.Item value={SvarbrevOptionEnum.SEND}>Send svarbrev</ToggleGroup.Item>
        <ToggleGroup.Item value={SvarbrevOptionEnum.DONT_SEND}>Ikke send svarbrev</ToggleGroup.Item>
      </ToggleGroup>
    </HStack>
  );
};

export const Svarbrev = () => (
  <>
    <SendSvarbrevToggle />
    <SvarbrevInput />
  </>
);

const SvarbrevInput = () => {
  const { typeId, svarbrev, mulighet, mulighetIsBasedOnJournalpost } = useRegistrering();
  const ytelseId = useYtelseId();
  const { data: svarbrevSetting } = useGetSvarbrevSettingQuery(
    typeId === null || ytelseId === null ? skipToken : { ytelseId, typeId },
  );

  if (typeId === null) {
    return null;
  }

  if (mulighet === null || (mulighetIsBasedOnJournalpost && typeof mulighet.id !== 'string')) {
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
      <HStack align="center" justify="center" height="42px" flexShrink="0">
        <Alert variant="info" size="small" inline>
          Velg ytelse
        </Alert>
      </HStack>
    );
  }

  if (svarbrevSetting === undefined) {
    return (
      <>
        <HStack align="center" justify="center" height="42px" flexShrink="0">
          <Loader size="small" />
        </HStack>
        <Card title="Svarbrev">
          <Placeholder>
            <EnvelopeOpenIcon aria-hidden />
          </Placeholder>
        </Card>
      </>
    );
  }

  return svarbrev.send ? (
    <InternalSvarbrevInput setting={svarbrevSetting} />
  ) : (
    <VarsletFrist setting={svarbrevSetting} />
  );
};
