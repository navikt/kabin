import { JournalposttypeEnum } from '@app/types/dokument';
import { Tag, type TagProps } from '@navikt/ds-react';

interface Props {
  journalposttype: JournalposttypeEnum;
}

export const Journalposttype = ({ journalposttype }: Props) => (
  <Tag
    className="w-6"
    variant={JOURNALPOST_TYPE_VARIANT[journalposttype]}
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

const JOURNALPOST_TYPE_VARIANT: Record<JournalposttypeEnum, TagProps['variant']> = {
  [JournalposttypeEnum.NOTAT]: 'alt1',
  [JournalposttypeEnum.INNGAAENDE]: 'alt2',
  [JournalposttypeEnum.UTGAAENDE]: 'alt3',
};
