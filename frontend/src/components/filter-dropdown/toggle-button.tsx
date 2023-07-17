import { styled } from 'styled-components';

interface Props {
  $open: boolean;
  $minHeight?: string;
  $error?: boolean;
}

export const ToggleButton = styled.button<Props>`
  border: 1px solid ${({ $error }) => ($error === true ? '#ba3a26' : 'var(--a-border-default)')};
  box-shadow: ${({ $error }) => ($error === true ? '0 0 0 1px #ba3a26' : 'none')};
  padding: 0 1.75rem 0 0.5rem;
  min-height: ${({ $minHeight }) => (typeof $minHeight === 'undefined' ? '2rem' : $minHeight)};
  width: 100%;
  white-space: nowrap;
  border-radius: 0.25rem;
  transition: box-shadow 0.1s ease;
  cursor: pointer;
  background: none;
  user-select: none;
  position: relative;
  font-size: 14px;
  font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
  color: var(--a-text-default);

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 0.5rem;
    border-radius: 2px;
    height: 1.5px;
    background: var(--a-text-default);
    right: 0.5rem;
    top: 50%;
    transition: transform 0.1s ease;
  }

  &::before {
    transform: ${({ $open }) =>
      $open ? 'translateX(-31%) translateY(-50%) rotate(-45deg)' : 'translateX(-31%) translateY(-50%) rotate(45deg)'};
  }

  &::after {
    transform: ${({ $open }) =>
      $open ? 'translateX(31%) translateY(-50%) rotate(45deg)' : 'translateX(31%) translateY(-50%) rotate(-45deg)'};
  }

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #254b6d;
  }

  &:disabled {
    cursor: not-allowed;
    border-color: #6a6a6a;
    background: #f1f1f1;
    opacity: 0.7;
  }
`;
