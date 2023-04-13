import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';
import { JournalposttypeEnum } from '@app/types/dokument';

interface Props {
  journalposttype: JournalposttypeEnum;
  size?: TagProps['size'];
}

export const Journalposttype = ({ journalposttype, size = 'small' }: Props) => (
  <Tag variant={JOURNALPOST_TYPE_VARIANT[journalposttype]} size={size} title={JOURNALPOST_TYPE_NAME[journalposttype]}>
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
