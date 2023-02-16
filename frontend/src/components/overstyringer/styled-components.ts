import styled from 'styled-components';
import { GridArea } from './types';

interface ContainerProps {
  $gridArea: GridArea;
  $inactive: boolean;
}

export const StyledContainer = styled.div<ContainerProps>`
  grid-area: ${({ $gridArea }) => $gridArea};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  column-gap: 8px;
  background-color: ${({ $inactive }) => ($inactive ? 'var(--a-gray-100)' : 'var(--a-blue-50)')};
  border: 1px solid ${({ $inactive }) => ($inactive ? 'var(--a-gray-400)' : 'var(--a-blue-200)')};
  padding: 16px;
  border-radius: 4px;
  min-height: 180px;
`;
