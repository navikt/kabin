export enum SectionNames {
  SAKSDATA = 'saksdata',
}

const SECTIONS: Record<SectionNames, string> = {
  [SectionNames.SAKSDATA]: 'Overstyringer for anken',
};

export const useSectionTitle = (section: SectionNames) => SECTIONS[section] ?? section;
