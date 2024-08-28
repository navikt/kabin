import { StaticDataContext } from '@app/components/app/static-data-context';
import { isNotNull } from '@app/functions/is-not';
import { type IAddress, isNorwegianAddress } from '@app/types/common';
import { useContext } from 'react';

export const useAddressLines = (address: IAddress | null): string[] => {
  const { getPoststed, getCountryName } = useContext(StaticDataContext);

  if (address === null) {
    return [];
  }

  const country = getCountryName(address.landkode) ?? address.landkode;

  return [
    address.adresselinje1,
    address.adresselinje2,
    address.adresselinje3,
    isNorwegianAddress(address)
      ? `${address.postnummer} ${getPoststed(address.postnummer) ?? address.postnummer}`
      : null,
    country,
  ].filter((line): line is string => isNotNull(line) && line.trim().length !== 0);
};
