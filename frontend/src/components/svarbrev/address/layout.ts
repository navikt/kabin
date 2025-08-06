import { css, styled } from 'styled-components';

export enum AddressState {
  SAVED = 0,
  OVERRIDDEN = 1,
  UNSAVED = 2,
}

export const Container = styled.div<{ $state: AddressState }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 32px;
  gap: 8px;
  padding: 8px;
  position: relative;
  background-color: ${({ $state }) => getBackgroundColor($state)};
`;

const getBackgroundColor = (state: AddressState) => {
  switch (state) {
    case AddressState.SAVED:
      return 'transparent';
    case AddressState.OVERRIDDEN:
      return 'var(--ax-bg-meta-purple-soft)';
    case AddressState.UNSAVED:
      return 'var(--ax-bg-warning-soft)';
  }
};

export const receiverStyle = css`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ax-border-neutral-subtle);
  border-left-width: 4px;
  border-radius: var(--ax-radius-4);
  padding: 0;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StyledReceiver = styled.section`
  ${receiverStyle}
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const FieldLabel = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  min-height: 24px;
`;
