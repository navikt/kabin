import { EditAddress } from '@app/components/svarbrev/address/edit-address';
import { ReadAddress } from '@app/components/svarbrev/address/read-address';
import type { Addresses } from '@app/components/svarbrev/address/types';
import type { IAddress, IPart } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';
import { useEffect, useState } from 'react';

interface Props extends Addresses {
  part: IPart;
  handling: HandlingEnum;
  onChange: (address: IAddress | null) => void;
  isLoading: boolean;
}

export const Address = ({ part, address, overriddenAddress, handling, onChange, isLoading }: Props) => {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (handling === HandlingEnum.LOCAL_PRINT) {
      setEdit(false);
    }
  }, [handling]);

  const onEdit = handling === HandlingEnum.LOCAL_PRINT ? undefined : () => setEdit(true);

  if (!edit || isLoading) {
    return (
      <ReadAddress
        part={part}
        address={address}
        overriddenAddress={overriddenAddress}
        onEdit={isLoading ? undefined : onEdit}
      />
    );
  }

  return (
    <EditAddress
      address={address}
      overriddenAddress={overriddenAddress}
      onSave={(newAddress) => {
        onChange(newAddress);
        setEdit(false);
      }}
      onCancel={() => setEdit(false)}
    />
  );
};
