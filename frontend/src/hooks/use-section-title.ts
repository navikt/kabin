import { useContext } from 'react';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
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
  const { type } = useContext(AppContext);

  switch (type) {
    case Type.KLAGE:
      return KLAGE_SECTIONS;
    case Type.ANKE:
      return ANKE_SECTIONS;
    case Type.NONE:
      return DEFAULT_SECTIONS;
  }
};

export const useSectionTitle = (section: SectionNames) => {
  const sections = useSections();

  return sections[section] ?? section;
};
