import { useContext } from 'react';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { SectionNames } from '@app/types/validation';

const ANKE_SECTIONS: Record<SectionNames, string> = {
  [SectionNames.SAKSDATA]: 'Tilpasninger for anken',
};

const KLAGE_SECTIONS: Record<SectionNames, string> = {
  [SectionNames.SAKSDATA]: 'Tilpasninger for klagen',
};

const DEFAULT_SECTIONS: Record<SectionNames, string> = {
  [SectionNames.SAKSDATA]: 'Tilpasninger',
};

const useSections = () => {
  const { type } = useContext(ApiContext);

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
