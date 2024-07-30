import { PlusIcon } from '@navikt/aksel-icons';
import { Button, Heading, Loader } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { Registreringer } from '@app/pages/index/registreringer';
import {
  useCreateRegistreringMutation,
  useGetFerdigeRegistreringerQuery,
  useGetUferdigeRegistreringerQuery,
} from '@app/redux/api/registrering';

export const IndexPage = () => {
  const { data: uferdige, isLoading: isUferdigeLoading } = useGetUferdigeRegistreringerQuery();
  const { data: ferdige, isLoading: isFerdigeLoading } = useGetFerdigeRegistreringerQuery({ sidenDager: 30 });

  if (isUferdigeLoading || isFerdigeLoading || uferdige === undefined || ferdige === undefined) {
    return (
      <PageWrapper>
        <Heading level="1" size="medium" spacing>
          Påbegynte registreringer
        </Heading>

        <CreateButton />

        <Loader />

        <Heading level="1" size="medium" spacing>
          Ferdige registreringer
        </Heading>

        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <CreateButton />
      <Registreringer registreringer={uferdige} isLoading={isUferdigeLoading} heading="Påbegynte registreringer" />
      <Registreringer
        registreringer={ferdige}
        isLoading={isFerdigeLoading}
        heading="Ferdige registreringer siste 30 dager"
      />
    </PageWrapper>
  );
};

const CreateButton = () => {
  const navigate = useNavigate();
  const [create, { isLoading }] = useCreateRegistreringMutation();

  const onClick = useCallback(async () => {
    const { id } = await create().unwrap();
    navigate(`/registrering/${id}`);
  }, [create, navigate]);

  return (
    <Button onClick={onClick} loading={isLoading} icon={<PlusIcon aria-hidden role="presentation" />}>
      Opprett ny registrering
    </Button>
  );
};

const PageWrapper = styled.main`
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  align-items: flex-start;
`;
