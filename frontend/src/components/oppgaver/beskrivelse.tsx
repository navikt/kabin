import { BulletListIcon, CaptionsIcon } from '@navikt/aksel-icons';
import { BodyLong, Heading, Tabs, Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { splitBeskrivelse } from '@app/components/oppgaver/split-beskrivelse';
import { useKlageenheter } from '@app/simple-api-state/use-kodeverk';

enum TabEnum {
  FORMATTED = 'formatted',
  RAW = 'raw',
}

export const Beskrivelse = ({ beskrivelse }: { beskrivelse: string | null }) => {
  const { data: enheter } = useKlageenheter();

  if (beskrivelse === null) {
    return (
      <StyledBeskrivelse>
        <Heading size="small" level="1">
          Beskrivelse
        </Heading>
        <StyledBodyLong>Ingen beskrivelse tilgjengelig.</StyledBodyLong>
      </StyledBeskrivelse>
    );
  }

  const entries = splitBeskrivelse(beskrivelse);
  const expectedEntries = beskrivelse.split('\n').filter((l) => l.includes('---')).length;

  const defaltTab = expectedEntries === entries.length ? TabEnum.FORMATTED : TabEnum.RAW;

  return (
    <StyledBeskrivelse>
      <Heading size="small" level="1">
        Beskrivelse
      </Heading>
      <Tabs defaultValue={defaltTab} size="small">
        <Tabs.List>
          <Tabs.Tab
            value={TabEnum.FORMATTED}
            label={`Formatert (${entries.length})`}
            icon={<BulletListIcon aria-hidden />}
          />
          <Tabs.Tab value={TabEnum.RAW} label={`Gosys (${expectedEntries})`} icon={<CaptionsIcon aria-hidden />} />
        </Tabs.List>
        <Tabs.Panel value={TabEnum.FORMATTED}>
          <StyledList>
            {entries.map((entry, index) => (
              <StyledListItem key={index}>
                <StyledHeader>
                  <Heading size="xsmall" level="2">
                    {entry.author.name}
                  </Heading>
                  <CopyPartIdButton id={entry.author.navIdent} size="xsmall" />

                  <StyledTag size="small" variant="alt1">
                    {enheter?.find((e) => e.id === entry.author.enhet)?.navn ?? entry.author.enhet} (
                    {entry.author.enhet})
                  </StyledTag>
                  <StyledTime>{entry.date}</StyledTime>
                </StyledHeader>
                <StyledBodyLong size="small">{entry.content}</StyledBodyLong>
              </StyledListItem>
            ))}
          </StyledList>
        </Tabs.Panel>
        <Tabs.Panel value={TabEnum.RAW}>
          <RawBeskrivelse size="small">{beskrivelse}</RawBeskrivelse>
        </Tabs.Panel>
      </Tabs>
    </StyledBeskrivelse>
  );
};

const StyledList = styled.ul`
  margin: 0;
  margin-top: 8px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  row-gap: 1em;
`;

const StyledListItem = styled.li`
  background-color: var(--a-surface-action-subtle);
  border-radius: var(--a-border-radius-xlarge);
  box-shadow: var(--a-shadow-xsmall);
  padding: 16px;
`;

const StyledHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
`;

const StyledTag = styled(Tag)`
  white-space: nowrap;
`;

const StyledTime = styled.time`
  font-style: italic;
  margin-bottom: 0.5rem;
  margin-left: auto;
  white-space: nowrap;
`;

const StyledBodyLong = styled(BodyLong)`
  white-space: pre-wrap;
  border-left: 4px solid var(--a-border-subtle);
  padding-left: 8px;
`;

const StyledBeskrivelse = styled.section`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

const RawBeskrivelse = styled(BodyLong)`
  white-space: pre-wrap;
  border-left: 4px solid var(--a-border-subtle);
  padding-left: 16px;
  margin-top: 8px;
`;
