import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';
import { IJournalposttype } from '../../types/dokument';

interface Props {
  journalposttype: IJournalposttype;
  size?: TagProps['size'];
}

export const Journalposttype = ({ journalposttype, size = 'small' }: Props) => (
  <Tag variant={JOURNALPOST_TYPE_VARIANT[journalposttype]} size={size} title={JOURNALPOST_TYPE_NAME[journalposttype]}>
    {journalposttype}
  </Tag>
);

const JOURNALPOST_TYPE_NAME: Record<IJournalposttype, string> = {
  [IJournalposttype.NOTAT]: 'Notat',
  [IJournalposttype.INNGAAENDE]: 'Inngående',
  [IJournalposttype.UTGAAENDE]: 'Utgående',
};

const JOURNALPOST_TYPE_VARIANT: Record<IJournalposttype, TagProps['variant']> = {
  [IJournalposttype.NOTAT]: 'alt1',
  [IJournalposttype.INNGAAENDE]: 'alt2',
  [IJournalposttype.UTGAAENDE]: 'alt3',
};
