import { SLIDE_DURATION } from '@app/components/toast/constants';
import { ToastType } from '@app/components/toast/types';
import { Button } from '@navikt/ds-react';
import { keyframes, styled } from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  column-gap: 8px;
  white-space: pre-wrap;
  hyphens: auto;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

export const StyledCloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  color: var(--ax-text-neutral);
`;

const scaleX = keyframes`
  from {
    transform: scaleX(100%);
  }

  to {
    transform: scaleX(0%);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0%);
  }
`;

interface BaseToastProps {
  $type: ToastType;
}

export const BaseToastStyle = styled.section<BaseToastProps>`
  color: var(--ax-text-neutral);
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ $type }) => getSubtleColor($type)};
  border-radius: var(--ax-radius-4);
  width: 300px;
  padding: var(--ax-space-16);
  border: 1px solid ${({ $type }) => getColor($type)};
`;

interface TimedToastProps {
  $paused: boolean;
  $timeout: number;
}

export const TimedToastStyle = styled(BaseToastStyle)<TimedToastProps>`
  animation-name: ${slideIn};
  animation-duration: ${SLIDE_DURATION}ms;
  animation-timing-function: ease-in-out;
  animation-delay: 0ms;
  animation-play-state: 'running';
  animation-fill-mode: forwards;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${({ $type }) => getColor($type)};
    transform-origin: left;
    animation-play-state: ${({ $paused }) => ($paused ? 'paused' : 'running')};
    animation-name: ${scaleX};
    animation-duration: ${({ $timeout }) => $timeout - SLIDE_DURATION}ms;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
`;

const getSubtleColor = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return 'var(--ax-bg-success-soft)';
    case ToastType.ERROR:
      return 'var(--ax-bg-danger-soft)';
    case ToastType.INFO:
      return 'var(--ax-bg-info-soft)';
    case ToastType.WARNING:
      return 'var(--ax-bg-warning-soft)';
  }
};

const getColor = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return 'var(--ax-bg-success-strong)';
    case ToastType.ERROR:
      return 'var(--ax-bg-danger-strong)';
    case ToastType.INFO:
      return 'var(--ax-bg-info-strong)';
    case ToastType.WARNING:
      return 'var(--ax-bg-warning-strong)';
  }
};
