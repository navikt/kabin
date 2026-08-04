import { Address } from '@app/components/svarbrev/address/address';
import { ToggleItem } from '@app/components/toggle-item/toggle-item';
import { areAddressesEqual } from '@app/functions/are-addresses-equal';
import type { Receiver } from '@app/redux/api/registreringer/types';
import { type IAddress, UTSENDINGSKANAL, Utsendingskanal } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, HStack, ToggleGroup, Tooltip } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

interface Props {
  part: Receiver['part'];
  id: Receiver['id'];
  overriddenAddress: Receiver['overriddenAddress'];
  handling: HandlingEnum;
  onChange: (receiverId: string, handling: HandlingEnum, overriddenAddress: IAddress | null) => void;
  isLoading: boolean;
}

export const Options = ({ part, handling, overriddenAddress, onChange, id, isLoading }: Props) => {
  const onHandlingChange = useCallback(
    (newHandling: string) => onChange(id, ensureIsHandling(newHandling), overriddenAddress),
    [id, onChange, overriddenAddress],
  );

  const onAddressChange = useCallback(
    (address: IAddress | null) => onChange(id, handling, areAddressesEqual(address, part.address) ? null : address),
    [handling, id, onChange, part.address],
  );

  const showAddress = useMemo(() => {
    if (handling === HandlingEnum.AUTO) {
      return (
        part.utsendingskanal === Utsendingskanal.SENTRAL_UTSKRIFT ||
        part.utsendingskanal === Utsendingskanal.LOKAL_UTSKRIFT
      );
    }

    return handling === HandlingEnum.CENTRAL_PRINT || handling === HandlingEnum.LOCAL_PRINT;
  }, [handling, part.utsendingskanal]);

  const isLocalPrint = useMemo(() => {
    if (handling === HandlingEnum.AUTO) {
      return part.utsendingskanal === Utsendingskanal.LOKAL_UTSKRIFT;
    }

    return handling === HandlingEnum.LOCAL_PRINT;
  }, [handling, part.utsendingskanal]);

  return (
    <>
      <HStack align="center" gap="space-8" paddingInline="space-8" paddingBlock="space-0 space-4">
        <ToggleGroup
          size="small"
          value={isLoading ? HandlingEnum.AUTO : handling}
          onChange={isLoading ? () => undefined : onHandlingChange}
          data-color={isLoading ? 'neutral' : 'accent'}
          aria-disabled={isLoading}
        >
          <ToggleItem value={HandlingEnum.AUTO} aria-disabled={isLoading}>
            {UTSENDINGSKANAL[part.utsendingskanal]}
          </ToggleItem>
          {part.utsendingskanal !== Utsendingskanal.SENTRAL_UTSKRIFT ? (
            <ToggleItem value={HandlingEnum.CENTRAL_PRINT} aria-disabled={isLoading}>
              Sentral utskrift
            </ToggleItem>
          ) : null}
          {part.utsendingskanal !== Utsendingskanal.LOKAL_UTSKRIFT ? (
            <ToggleItem value={HandlingEnum.LOCAL_PRINT} aria-disabled={isLoading}>
              Lokal utskrift
            </ToggleItem>
          ) : null}
        </ToggleGroup>

        {handling === HandlingEnum.AUTO ? null : (
          <Tooltip content={`Tilbakestill til "${UTSENDINGSKANAL[part.utsendingskanal]}"`}>
            <Button
              data-color="neutral"
              size="small"
              variant="tertiary"
              onClick={() => onHandlingChange(HandlingEnum.AUTO)}
              icon={<ArrowUndoIcon aria-hidden />}
            />
          </Tooltip>
        )}
      </HStack>
      <HStack align="center" gap="space-8" paddingInline="space-8" paddingBlock="space-0 space-4">
        {isLocalPrint ? (
          <Alert size="small" variant="info">
            <BodyShort size="small">Du må skrive ut dokumentet selv og legge det til utsending.</BodyShort>
          </Alert>
        ) : null}
      </HStack>
      {showAddress ? (
        <Address
          part={part}
          address={part.address}
          overriddenAddress={overriddenAddress}
          onChange={onAddressChange}
          handling={handling}
          isLoading={isLoading}
        />
      ) : null}
    </>
  );
};

const ensureIsHandling = (handling: string): HandlingEnum => {
  if (
    handling === HandlingEnum.AUTO ||
    handling === HandlingEnum.LOCAL_PRINT ||
    handling === HandlingEnum.CENTRAL_PRINT
  ) {
    return handling;
  }

  return HandlingEnum.AUTO;
};
