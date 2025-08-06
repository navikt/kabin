import { Card, CardFullHeight, CardMedium, CardSmall } from '@app/components/card/card';
import { LoadingDocuments } from '@app/components/documents/loading-documents';
import { LoadingGosysOppgaver } from '@app/components/gosys-oppgaver/loading-gosys-oppgaver';
import { LoadingKlagemuligheter } from '@app/components/muligheter/klage/loading-klagemuligheter';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { LeftColumn, RightColumn, StyledMain } from '@app/pages/registrering/styled-components';
import { FileTextIcon } from '@navikt/aksel-icons';
import { Skeleton } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const LoadingOverstyringer = () => (
  <Card>
    <OverstyringerTop>
      <Skeleton height={40} width={150} />
      <Skeleton height={40} width={70} />
      <Skeleton height={40} width={200} />
      <Skeleton height={24} width={100} />
    </OverstyringerTop>

    <YtelseHjemler>
      <Skeleton height={40} width={300} />
      <Skeleton height={40} />
    </YtelseHjemler>

    <Parts>
      <Part />
      <Part />
      <Part />
    </Parts>
  </Card>
);

export const LoadingSvarbrev = () => (
  <ToggleContainer>
    <Skeleton height={40} width={125} />
    <Skeleton height={40} width={125} />
  </ToggleContainer>
);

export const LoadingRegistrering = () => (
  <StyledMain>
    <Person>
      <Skeleton height={40} width={300} />
    </Person>
    <LeftColumn>
      <CardMedium>
        <LoadingDocuments />
      </CardMedium>

      <ToggleContainer>
        <Skeleton height={40} width={75} />
        <Skeleton height={40} width={75} />
      </ToggleContainer>

      <CardSmall>
        <LoadingKlagemuligheter />
      </CardSmall>

      <LoadingGosysOppgaver />

      <LoadingOverstyringer />

      <LoadingSvarbrev />
    </LeftColumn>
    <RightColumn>
      <CardFullHeight>
        <Placeholder>
          <FileTextIcon aria-hidden />
        </Placeholder>
      </CardFullHeight>
    </RightColumn>
  </StyledMain>
);

const Person = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-top: 8px;
`;

const Part = () => (
  <LoadingPart>
    <Skeleton height={24} width={100} />
    <Skeleton height={24} width={200} />
    <Skeleton height={24} width={70} />
  </LoadingPart>
);

const ToggleContainer = styled.div`
  display: flex;
  gap: 2px;
  align-self: center;
`;

const YtelseHjemler = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const OverstyringerTop = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LoadingPart = styled.div`
  height: 166px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  padding-left: 32px;
  border-radius: var(--ax-radius-4);
  border: 1px solid var(--ax-border-neutral-subtle);
`;

const Parts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;
