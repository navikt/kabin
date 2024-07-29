import { Button, Loader } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { PersonInfo } from '@app/pages/create/person/info';
import { PersonSearch } from '@app/pages/create/person/search';
import { useGetRegistreringQuery } from '@app/redux/api/registrering';

export const Person = () => {
  const registreringId = useRegistreringId();
  const { data: registrering } = useGetRegistreringQuery(registreringId);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (registrering === undefined) {
    return <Loader />;
  }

  if (isEditing || registrering.sakenGjelderValue === null) {
    return (
      <Container>
        <PersonSearch />
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
