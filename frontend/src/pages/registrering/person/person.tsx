import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { PersonInfo } from '@app/pages/registrering/person/info';
import { PersonSearch } from '@app/pages/registrering/person/search';

export const Person = () => {
  const registrering = useRegistrering();
  const canEdit = useCanEdit();

  const { sakenGjelderValue } = registrering;

  if (!canEdit) {
    return sakenGjelderValue === null ? (
      <Container>
        <Tag variant="alt3" size="small">
          <i>Ingen person valgt</i>
        </Tag>
      </Container>
    ) : (
      <Container>
        <PersonInfo sakenGjelderValue={sakenGjelderValue} />
      </Container>
    );
  }

  return (
    <Container>
      <PersonSearch />
      {sakenGjelderValue === null ? null : <PersonInfo sakenGjelderValue={sakenGjelderValue} />}
    </Container>
  );
};

const Container = styled.div`
  grid-area: search;
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 8px;
  background-color: white;
`;
