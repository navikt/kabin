import { styled } from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-end;
  flex-grow: 1;
`;

export const Container = styled.div`
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 8px;
`;
