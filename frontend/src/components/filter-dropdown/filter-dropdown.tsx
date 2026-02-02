import { Dropdown } from '@app/components/filter-dropdown/dropdown';
import type { BaseProps } from '@app/components/filter-dropdown/props';
import { ToggleButton } from '@app/components/filter-dropdown/toggle-button';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { Box, Label, VStack } from '@navikt/ds-react';
import type { CSSProperties, JSX } from 'react';
import { useId, useRef, useState } from 'react';

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
  style?: CSSProperties;
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
  className = '',
  disabled = false,
  title,
  error,
  id,
  style,
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
    <VStack
      as="section"
      ref={ref}
      data-testid={testId}
      gap="space-12"
      className={className}
      title={title}
      style={style}
    >
      {typeof label === 'string' ? (
        <Label htmlFor={buttonId} size="medium">
          {label}
        </Label>
      ) : null}
      <div className="relative">
        <ToggleButton
          id={buttonId}
          open={isOpen}
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
      </div>
      <ValidationErrorMessage error={error} />
    </VStack>
  );
};

interface PopupProps {
  isOpen: boolean;
  align?: 'left' | 'right';
  direction?: 'up' | 'down';
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Popup = ({ isOpen, align, direction, children, fullWidth = false }: PopupProps) => {
  if (!isOpen) {
    return null;
  }

  const positionClasses = [
    direction === 'up' ? 'bottom-full' : 'top-full',
    align === 'left' ? 'right-0' : 'left-0',
    'z-3',
  ].join(' ');

  return (
    <Box
      asChild
      position="absolute"
      width={fullWidth ? '100%' : '275px'}
      maxHeight="350px"
      borderRadius="4"
      background="raised"
      shadow="dialog"
    >
      <VStack className={positionClasses}>{children}</VStack>
    </Box>
  );
};

const getSelectedLength = (label: string | undefined, num: number, total: number) =>
  label === undefined ? `${num}/${total} valgt` : `${label} (${num}/${total})`;
