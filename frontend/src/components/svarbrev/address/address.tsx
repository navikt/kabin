import React, { useEffect, useState } from 'react';
import { EditAddress } from '@app/components/svarbrev/address/edit-address';
import { ReadAddress } from '@app/components/svarbrev/address/read-address';
import { Addresses } from '@app/components/svarbrev/address/types';
import { IAddress, IPart } from '@app/types/common';
import { HandlingEnum } from '@app/types/recipient';

interface Props extends Addresses {
  part: IPart;
  handling: HandlingEnum;
  onChange: (address: IAddress | null) => void;
}

export const Address = ({ part, address, overriddenAddress, handling, onChange }: Props) => {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (handling === HandlingEnum.LOCAL_PRINT) {
      setEdit(false);
    }
  }, [handling]);

  const onEdit = handling === HandlingEnum.LOCAL_PRINT ? undefined : () => setEdit(true);

  if (!edit) {
    return <ReadAddress part={part} address={address} overriddenAddress={overriddenAddress} onEdit={onEdit} />;
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
