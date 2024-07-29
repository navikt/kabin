import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { Registreringer } from '@app/pages/index/registreringer';
import {
  useCreateRegistreringMutation,
  useGetFerdigeRegistreringerQuery,
  useGetUferdigeRegistreringerQuery,
} from '@app/redux/api/registrering';

export const IndexPage = () => {
  const { data: uferdige, isLoading: isUferdigeLoading } = useGetUferdigeRegistreringerQuery();
  const { data: ferdige, isLoading: isFerdigeLoading } = useGetFerdigeRegistreringerQuery();

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
      <Heading level="1" size="medium" spacing>
        Påbegynte registreringer
      </Heading>

      <CreateButton />

      <Registreringer registreringer={uferdige} isLoading={isUferdigeLoading} />

      <Heading level="1" size="medium" spacing>
        Ferdige registreringer
      </Heading>

      <Registreringer registreringer={ferdige} isLoading={isFerdigeLoading} />
    </PageWrapper>
  );
};

const CreateButton = () => {
  const [create, { isLoading }] = useCreateRegistreringMutation();

  return (
    <Button onClick={() => create()} loading={isLoading} icon={<PlusCircleIcon aria-hidden role="presentation" />}>
      Opprett ny registrering
    </Button>
  );
};

const PageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
`;
