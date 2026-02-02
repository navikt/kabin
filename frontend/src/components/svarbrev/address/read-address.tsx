import { AddressState, Container, Row } from '@app/components/svarbrev/address/layout';
import type { Addresses } from '@app/components/svarbrev/address/types';
import { useAddressLines } from '@app/components/svarbrev/address/use-address-lines';
import { areAddressesEqual } from '@app/functions/are-addresses-equal';
import type { IPart } from '@app/types/common';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, Tag, Tooltip } from '@navikt/ds-react';

interface Props extends Addresses {
  part: IPart;
  onEdit?: (() => void) | undefined;
}

export const ReadAddress = ({ part, address, overriddenAddress, onEdit }: Props) => {
  const addressLines = useAddressLines(overriddenAddress ?? address);
  const copyAddress = formatCopyAddress(part, addressLines);
  const isOverridden = overriddenAddress !== null && !areAddressesEqual(address, overriddenAddress);

  const noAddress = addressLines.length === 0;

  return (
    <Container state={isOverridden ? AddressState.OVERRIDDEN : AddressState.SAVED}>
      <Row>
        <span>{noAddress ? 'Ingen adresse' : addressLines.join(', ')}</span>

        {noAddress ? null : (
          <Tooltip content="Kopier navn og adresse">
            <CopyButton size="xsmall" variant="neutral" copyText={copyAddress} title="Kopier navn og adresse" />
          </Tooltip>
        )}

        {onEdit === undefined ? null : (
          <Tooltip content="Overstyr adressen kun for dette dokumentet.">
            <Button
              data-color="neutral"
              size="xsmall"
              variant="tertiary"
              onClick={onEdit}
              icon={<PencilIcon aria-hidden />}
            >
              Endre
            </Button>
          </Tooltip>
        )}

        {isOverridden ? (
          <Tag data-color="warning" variant="outline" size="small">
            Overstyrt
          </Tag>
        ) : null}
      </Row>
    </Container>
  );
};

const formatCopyAddress = (part: IPart, addressLines: string[]): string => [part.name, ...addressLines].join('\n');
