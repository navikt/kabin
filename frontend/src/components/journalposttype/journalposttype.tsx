import { JournalposttypeEnum } from '@app/types/dokument';
import { Tag, type TagProps } from '@navikt/ds-react';

interface Props {
  journalposttype: JournalposttypeEnum;
}

export const Journalposttype = ({ journalposttype }: Props) => (
  <Tag
    className="w-6"
    variant="outline"
    data-color={JOURNALPOST_TYPE_COLOR[journalposttype]}
    size="small"
    title={JOURNALPOST_TYPE_NAME[journalposttype]}
  >
    {journalposttype}
  </Tag>
);

const JOURNALPOST_TYPE_NAME: Record<JournalposttypeEnum, string> = {
  [JournalposttypeEnum.NOTAT]: 'Notat',
  [JournalposttypeEnum.INNGAAENDE]: 'Inngående',
  [JournalposttypeEnum.UTGAAENDE]: 'Utgående',
};

const JOURNALPOST_TYPE_COLOR: Record<JournalposttypeEnum, TagProps['data-color']> = {
  [JournalposttypeEnum.NOTAT]: 'meta-purple',
  [JournalposttypeEnum.INNGAAENDE]: 'meta-lime',
  [JournalposttypeEnum.UTGAAENDE]: 'info',
};
