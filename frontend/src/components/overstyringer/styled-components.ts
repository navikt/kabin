import { BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';
import { GridArea } from './types';

export enum States {
  SET = 'SET',
  UNSET = 'UNSET',
  ERROR = 'ERROR',
}

export const getState = <T>(value: T | null, error?: string): States => {
  if (typeof error === 'string' && error.length !== 0) {
    return States.ERROR;
  }

  if (value !== null) {
    return States.SET;
  }

  return States.UNSET;
};

interface ContainerProps {
  $gridArea: GridArea;
  $state: States;
}

const BACKGROUND_COLORS: Record<States, string> = {
  [States.SET]: 'var(--a-blue-50)',
  [States.UNSET]: 'var(--a-gray-100)',
  [States.ERROR]: 'var(--a-red-100)',
};

const BORDER_COLORS: Record<States, string> = {
  [States.SET]: 'var(--a-blue-200)',
  [States.UNSET]: 'var(--a-gray-400)',
  [States.ERROR]: 'var(--a-red-400)',
};

export const StyledContainer = styled.div<ContainerProps>`
  grid-area: ${({ $gridArea }) => $gridArea};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  column-gap: 8px;
  background-color: ${({ $state }) => (BACKGROUND_COLORS[$state] ? BACKGROUND_COLORS[$state] : 'var(--a-gray-100)')};
  border: 1px solid ${({ $state }) => (BORDER_COLORS[$state] ? BORDER_COLORS[$state] : 'var(--a-gray-400)')};
  padding: 16px;
  border-radius: 4px;
  min-height: 180px;
`;

export const StyledPartName = styled(BodyShort)`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;

export const PartContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 8px;
  flex-grow: 1;
`;

export const PartTextContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  flex-grow: 1;
`;

export const PartActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: left;
  justify-self: end;
  flex-shrink: 0;
  flex-grow: 0;
`;
