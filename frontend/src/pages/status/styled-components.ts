import { BodyShort, Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';

export const StyledCard = styled(Card)<{ $gridArea: string }>`
  grid-area: ${({ $gridArea }) => $gridArea};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const StyledPart = styled(BodyShort)`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const DataContainer = styled.section`
  width: 1000px;
  display: grid;
  grid-template-areas: 'title title' 'info info' 'journalpost case' 'journalpost mulighet';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, min-content);
  gap: 32px;
  margin: 0 auto;
`;

export const LoadingContainer = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const StyledLoader = styled(Loader)`
  align-self: center;
`;

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 32px;
  padding-bottom: 32px;
  background: var(--a-bg-subtle);
  overflow: auto;
`;
