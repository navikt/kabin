import { useAddressLines } from '@app/components/svarbrev/address/use-address-lines';
import { useRegistrering } from '@app/hooks/use-registrering';
import type { Receiver } from '@app/redux/api/registreringer/types';
import { UTSENDINGSKANAL, Utsendingskanal } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';
import { Box, Heading, HGrid, Label, Tag, Tooltip, VStack } from '@navikt/ds-react';

const getHandlingLabel = (handling: HandlingEnum | null, utsendingskanal: Utsendingskanal) => {
  switch (handling) {
    case HandlingEnum.AUTO:
      return UTSENDINGSKANAL[utsendingskanal];
    case HandlingEnum.CENTRAL_PRINT:
      return UTSENDINGSKANAL[Utsendingskanal.SENTRAL_UTSKRIFT];
    case HandlingEnum.LOCAL_PRINT:
      return UTSENDINGSKANAL[Utsendingskanal.LOKAL_UTSKRIFT];
    case null:
      return 'Ikke tilgjengelig';
  }
};

const ReadOnlyReceiver = ({ receiver }: { receiver: Receiver }) => {
  const { handling } = receiver;

  const isAutoHandling = handling === HandlingEnum.AUTO;
  const channelLabel = getHandlingLabel(handling, receiver.part.utsendingskanal);

  const addressIsOverridden = receiver.overriddenAddress !== null;
  const addressLines = useAddressLines(addressIsOverridden ? receiver.overriddenAddress : receiver.part.address);

  return (
    <li>
      <Box background="neutral-soft" padding="space-0" borderRadius="4" borderColor="neutral" borderWidth="1">
        <Box padding="space-8">
          <VStack gap="space-8" align="start">
            <Label as={Heading} level="1" size="small">
              {receiver.part.name}
            </Label>

            <Tooltip content={isAutoHandling ? 'Standardkanal' : 'Manuelt overstyrt kanal'}>
              <Tag variant={isAutoHandling ? 'info' : 'warning'} size="small">
                {channelLabel}
              </Tag>
            </Tooltip>
          </VStack>
        </Box>

        {addressLines.length === 0 ? null : (
          <Tooltip content={addressIsOverridden ? 'Manuelt overstyrt addresse' : 'Standardadresse'}>
            <Box
              background={addressIsOverridden ? 'warning-soft' : undefined}
              padding="space-8"
              borderRadius="4"
              borderColor="neutral"
              borderWidth="0"
            >
              {addressLines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </Box>
          </Tooltip>
        )}
      </Box>
    </li>
  );
};

export const ReadOnlyReceivers = () => {
  const { svarbrev } = useRegistrering();

  const list = svarbrev.receivers.map((r) => <ReadOnlyReceiver key={r.id} receiver={r} />);

  return (
    <section>
      <Label as={Heading} level="1" size="small" spacing>
        {list.length === 1 ? 'Mottaker' : 'Mottakere'}
      </Label>
      <HGrid columns={2} gap="space-8" as="ul" className="list-none" style={{ margin: 0, padding: 0 }}>
        {list}
      </HGrid>
    </section>
  );
};
