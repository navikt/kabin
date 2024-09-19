import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { PersonDetails } from '@app/pages/registrering/person/details';
import { PersonSearch } from '@app/pages/registrering/person/search';
import { Tag } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import { useState } from 'react';
import { styled } from 'styled-components';

export const Person = () => {
  const { sakenGjelderValue } = useRegistrering();
  const [newSakenGjelder, setNewSakenGjelder] = useState('');
  const canEdit = useCanEdit();

  if (!canEdit) {
    return sakenGjelderValue === null ? (
      <Container>
        <Tag variant="alt3" size="small">
          <i>Ingen person valgt</i>
        </Tag>
      </Container>
    ) : (
      <Container>
        <PersonDetails sakenGjelderValue={sakenGjelderValue} />
      </Container>
    );
  }

  const cleaned = newSakenGjelder.replaceAll(/\s/g, '');
  const isValid = idnr(cleaned).status === 'valid';
  const isSame = sakenGjelderValue === cleaned;

  return (
    <Container>
      <PersonSearch onChange={setNewSakenGjelder} value={newSakenGjelder} />

      {/* Saken gjelder in search */}
      {isValid && !isSame ? <PersonDetails sakenGjelderValue={newSakenGjelder} /> : null}

      {/* Saken gjelder in registrering */}
      {sakenGjelderValue === null ? null : <PersonDetails sakenGjelderValue={sakenGjelderValue} />}
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
  padding: 16px;
  padding-bottom: 8px;
  background-color: white;
`;
