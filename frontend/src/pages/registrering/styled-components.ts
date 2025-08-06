import { styled } from 'styled-components';

export const StyledMain = styled.main`
  display: grid;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  grid-template-areas: 'search search' 'left right';
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content 1fr;
  column-gap: 0;
  width: 100%;
  flex-grow: 1;
  overflow-y: hidden;
  overflow-x: auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding-top: 8px;
  padding-bottom: 16px;
  height: 100%;
  width: 100%;
`;

export const LeftColumn = styled(Column)`
  grid-area: left;
  width: 1150px;
  overflow-y: auto;
  overflow-x: auto;
  padding-left: 16px;
  padding-right: 8px;
`;

export const RightColumn = styled(Column)`
  grid-area: right;
  max-width: 1500px;
  min-width: 500px;
  overflow: hidden;
  padding-right: 16px;
  padding-left: 8px;
`;
