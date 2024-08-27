export enum ReceiverType {
  KLAGER = '1',
  SAKEN_GJELDER = '2',
  FULLMEKTIG = '3',
}

const getTypeName = (type: ReceiverType): string => {
  switch (type) {
    case ReceiverType.KLAGER:
      return 'Ankende part';
    case ReceiverType.FULLMEKTIG:
      return 'Fullmektig';
    case ReceiverType.SAKEN_GJELDER:
      return 'Saken gjelder';
    default:
      return '';
  }
};

export const getTypeNames = (types: ReceiverType[]): string => {
  const [first, second, third] = types;

  if (first === undefined) {
    return 'Ingen saksrolle funnet';
  }

  if (types.length === 1 || second === undefined) {
    return getTypeName(first);
  }

  if (types.length === 2 || third === undefined) {
    return `${getTypeName(first)} og ${getTypeName(second).toLowerCase()}`;
  }

  return `${getTypeName(first)}, ${getTypeName(second).toLowerCase()} og ${getTypeName(third).toLowerCase()}`;
};
