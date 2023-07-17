import { Button, Search, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

export enum GridArea {
  EXPAND = 'expand',
  TITLE = 'title',
  TEMA = 'tema',
  DATE = 'date',
  AVSENDER_MOTTAKER = 'avsenderMottaker',
  SAKS_ID = 'saksId',
  TYPE = 'type',
  VIEW = 'view',
  SELECT = 'select',
}

const gridTemplateAreas = [
  GridArea.TITLE,
  GridArea.TEMA,
  GridArea.DATE,
  GridArea.AVSENDER_MOTTAKER,
  GridArea.SAKS_ID,
  GridArea.TYPE,
  GridArea.VIEW,
  GridArea.SELECT,
];

export const StyledGrid = styled.div<{ $showViewed?: boolean }>`
  display: grid;
  grid-template-columns: minmax(250px, 2fr) minmax(150px, 1fr) 85px minmax(200px, 2fr) 110px 90px 30px 55px;
  grid-template-areas: '${gridTemplateAreas.join(' ')}';
  grid-gap: 8px;
  background-color: ${({ $showViewed = false }) => ($showViewed ? 'var(--a-orange-100)' : 'transparent')};

  &:hover {
    background-color: ${({ $showViewed = false }) => ($showViewed ? 'var(--a-orange-200)' : 'transparent')};
  }
`;

interface GridAreaProps {
  $gridArea: GridArea;
}

export const GridSearch = styled(Search)<GridAreaProps>`
  grid-area: ${({ $gridArea }) => $gridArea};
`;

export const StyledField = styled.span<GridAreaProps>`
  grid-area: ${({ $gridArea }) => $gridArea};
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

export const GridButton = styled(Button)<GridAreaProps>`
  grid-area: ${({ $gridArea }) => $gridArea};
`;

export const GridTag = styled(Tag)<GridAreaProps>`
  grid-area: ${({ $gridArea }) => $gridArea};
`;
