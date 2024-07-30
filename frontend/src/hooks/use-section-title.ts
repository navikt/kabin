import { useRegistrering } from '@app/hooks/use-registrering';
import { SaksTypeEnum } from '@app/types/common';
import { SectionNames } from '@app/types/validation';

const ANKE_SECTIONS: Record<SectionNames, string> = {
  [SectionNames.SAKSDATA]: 'Tilpasninger for anken',
  [SectionNames.SVARBREV]: 'Svarbrev',
};

const KLAGE_SECTIONS: Record<SectionNames, string> = {
  [SectionNames.SAKSDATA]: 'Tilpasninger for klagen',
  [SectionNames.SVARBREV]: 'Svarbrev',
};

const DEFAULT_SECTIONS: Record<SectionNames, string> = {
  [SectionNames.SAKSDATA]: 'Tilpasninger',
  [SectionNames.SVARBREV]: 'Svarbrev',
};

const useSections = () => {
  const { typeId } = useRegistrering();

  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return KLAGE_SECTIONS;
    case SaksTypeEnum.ANKE:
      return ANKE_SECTIONS;
    case null:
      return DEFAULT_SECTIONS;
  }
};

export const useSectionTitle = (section: SectionNames) => {
  const sections = useSections();

  return sections[section] ?? section;
};
