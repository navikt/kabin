import { JournalposttypeEnum } from '@app/types/dokument';
import { Tag, type TagProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  journalposttype: JournalposttypeEnum;
}

export const Journalposttype = ({ journalposttype }: Props) => (
  <StyledTag
    variant={JOURNALPOST_TYPE_VARIANT[journalposttype]}
    size="small"
    title={JOURNALPOST_TYPE_NAME[journalposttype]}
  >
    {journalposttype}
  </StyledTag>
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

const StyledTag = styled(Tag)`
  width: 24px;
`;
