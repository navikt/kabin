import { Filtype, VariantFormat, type Variants } from '@app/types/dokument';
import { Tag, Tooltip } from '@navikt/ds-react';

export const getDefaultVariant = (varianter: Variants) => {
  const [first, second] = varianter;

  if (first === undefined) {
    return null;
  }

  if (first.format === VariantFormat.SLADDET) {
    return first;
  }

  if (second === undefined) {
    return first;
  }

  if (second.format === VariantFormat.SLADDET) {
    return second;
  }

  return first;
};

export const canOpen = (varianter: Variants): boolean => varianter.some(({ filtype }) => filtype === Filtype.PDF);

export const hasRedactedVariant = (varianter: Variants): boolean =>
  varianter.some(({ format }) => format === VariantFormat.SLADDET);

const FILE_TYPE_NAMES: Record<Filtype, string> = {
  [Filtype.PDF]: 'PDF',
  [Filtype.XLSX]: 'Excel',
  [Filtype.JPEG]: 'JPEG',
  [Filtype.PNG]: 'PNG',
  [Filtype.TIFF]: 'TIFF',
  [Filtype.JSON]: 'JSON',
  [Filtype.XML]: 'XML',
  [Filtype.AXML]: 'AXML',
  [Filtype.DXML]: 'DXML',
  [Filtype.RTF]: 'RTF',
};

interface FiletypeProps {
  varianter: Variants;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const FileType = ({ varianter, className, ref }: FiletypeProps) => {
  const variant = getDefaultVariant(varianter);

  if (variant === null) {
    return null;
  }

  return (
    <Tooltip content={`Filtype ${FILE_TYPE_NAMES[variant.filtype]} kan ikke åpnes i Kabin. Må lastes ned.`}>
      <Tag variant="neutral-filled" size="xsmall" className={className} ref={ref}>
        {FILE_TYPE_NAMES[variant.filtype]}
      </Tag>
    </Tooltip>
  );
};
