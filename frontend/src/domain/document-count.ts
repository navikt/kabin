export const getDocumentCountText = (count: number): string => {
  if (count === 0) {
    return 'Ingen dokumenter';
  }

  if (count === 1) {
    return '1 hoveddokument uten vedlegg';
  }

  return `1 hoveddokument med ${count - 1} vedlegg`;
};
