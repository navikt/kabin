import { getKlagerTitle } from '@app/functions/get-klager-name';
import { useRegistrering } from '@app/hooks/use-registrering';
import type { RegistreringType } from '@app/types/common';

export enum ReceiverType {
  KLAGER = '1',
  SAKEN_GJELDER = '2',
  FULLMEKTIG = '3',
}

const getTypeName = (type: ReceiverType, registreringType: RegistreringType): string => {
  switch (type) {
    case ReceiverType.KLAGER:
      return getKlagerTitle(registreringType);
    case ReceiverType.FULLMEKTIG:
      return 'Fullmektig';
    case ReceiverType.SAKEN_GJELDER:
      return 'Saken gjelder';
    default:
      return '';
  }
};

export const getTypeNames = (types: ReceiverType[]): string => {
  const { typeId } = useRegistrering();
  const [first, second, third] = types;

  if (first === undefined || typeId === null) {
    return 'Ingen saksrolle funnet';
  }

  if (types.length === 1 || second === undefined) {
    return getTypeName(first, typeId);
  }

  if (types.length === 2 || third === undefined) {
    return `${getTypeName(first, typeId)} og ${getTypeName(second, typeId).toLowerCase()}`;
  }

  return `${getTypeName(first, typeId)}, ${getTypeName(second, typeId).toLowerCase()} og ${getTypeName(third, typeId).toLowerCase()}`;
};
