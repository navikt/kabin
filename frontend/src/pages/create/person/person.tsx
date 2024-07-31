import { Button, Tag } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { PersonInfo } from '@app/pages/create/person/info';
import { PersonSearch } from '@app/pages/create/person/search';

export const Person = () => {
  const registrering = useRegistrering();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const canEdit = useCanEdit();

  if (!canEdit) {
    const { sakenGjelderValue } = registrering;

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

  if (isEditing || registrering.sakenGjelderValue === null) {
    return (
      <Container>
        <PersonSearch onDone={() => setIsEditing(false)} />
      </Container>
    );
  }

  return (
    <Container>
      <PersonInfo sakenGjelderValue={registrering.sakenGjelderValue} />
      <Button size="small" variant="secondary" onClick={() => setIsEditing(true)}>
        Endre
      </Button>
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
