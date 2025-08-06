import { Card } from '@app/components/card/card';
import { BodyShort, Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const StyledCard = styled(Card)<{ $gridArea: string }>`
  grid-area: ${({ $gridArea }) => $gridArea};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  background-color: var(--ax-bg-default);
`;

export const StyledPart = styled(BodyShort)`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const DataContainer = styled.section`
  width: 1000px;
  display: grid;
  grid-template-areas: 'journalpost case' 'svarbrev-metadata mulighet' 'svarbrev-pdf svarbrev-pdf';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, min-content);
  gap: 24px;
  margin: 0 auto;
`;

export const LoadingContainer = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0 auto;
`;

export const StyledLoader = styled(Loader)`
  align-self: center;
`;
