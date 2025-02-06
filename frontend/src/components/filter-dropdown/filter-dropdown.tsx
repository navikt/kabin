import { Dropdown } from '@app/components/filter-dropdown/dropdown';
import type { BaseProps } from '@app/components/filter-dropdown/props';
import { ToggleButton } from '@app/components/filter-dropdown/toggle-button';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { Label } from '@navikt/ds-react';
import { type JSX, useId, useRef, useState } from 'react';
import { styled } from 'styled-components';

interface FilterDropdownProps<T extends string> extends BaseProps<T> {
  fullWidth?: boolean;
  children: React.ReactNode;
  testId?: string;
  align?: PopupProps['align'];
  direction?: PopupProps['direction'];
  label?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  error?: string;
  id?: string;
}

export const FilterDropdown = <T extends string>({
  options,
  selected,
  onChange,
  children,
  label,
  testId,
  align,
  direction,
  fullWidth,
  className,
  disabled = false,
  title,
  error,
  id,
}: FilterDropdownProps<T>): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fallbackId = useId();
  const buttonId = id ?? fallbackId;

  useOnClickOutside(() => setIsOpen(false), ref, true);

  const closeDropdown = () => {
    buttonRef.current?.focus();
    setIsOpen(false);
  };

  return (
    <StyledFilterDropdown ref={ref} data-testid={testId} className={className} title={title}>
      {typeof label === 'string' ? (
        <Label htmlFor={buttonId} size="medium">
          {label}
        </Label>
      ) : null}
      <Container>
        <ToggleButton
          id={buttonId}
          $open={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          ref={buttonRef}
          disabled={disabled}
          data-testid="toggle-button"
        >
          {typeof children === 'string' ? getSelectedLength(label, selected.length, options.length) : children}
        </ToggleButton>
        <Popup isOpen={isOpen} align={align} direction={direction} fullWidth={fullWidth}>
          <Dropdown
            selected={selected}
            options={options}
            isOpen={isOpen}
            onChange={onChange}
            closeDropdown={closeDropdown}
          />
        </Popup>
      </Container>
      <ValidationErrorMessage error={error} />
    </StyledFilterDropdown>
  );
};

const Container = styled.div`
  position: relative;
`;

const StyledFilterDropdown = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface PopupProps {
  isOpen: boolean;
  align: StyledPopupProps['$align'];
  direction: StyledPopupProps['$direction'];
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Popup = ({ isOpen, align, direction, children, fullWidth = false }: PopupProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <StyledPopup $align={align} $direction={direction} $fullWidth={fullWidth}>
      {children}
    </StyledPopup>
  );
};

interface StyledPopupProps {
  $align?: 'left' | 'right';
  $direction?: 'up' | 'down';
  $fullWidth: boolean;
}

const StyledPopup = styled.div<StyledPopupProps>`
  display: flex;
  position: absolute;
  top: ${({ $direction }) => ($direction === 'up' ? 'auto' : '100%')};
  bottom: ${({ $direction }) => ($direction === 'up' ? '100%' : 'auto')};
  left: ${({ $align }) => ($align === 'left' ? 'auto' : '0')};
  right: ${({ $align }) => ($align === 'left' ? '0' : 'auto')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '275px')};
  max-height: 350px;
  z-index: 3;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;

const getSelectedLength = (label: string | undefined, num: number, total: number) =>
  label === undefined ? `${num}/${total} valgt` : `${label} (${num}/${total})`;
