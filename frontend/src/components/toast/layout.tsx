import { SLIDE_DURATION } from '@app/components/toast/constants';
import { ToastType } from '@app/components/toast/types';
import { Button, type ButtonProps, VStack } from '@navikt/ds-react';
import { type CSSProperties, forwardRef, type HTMLAttributes } from 'react';

interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const Container = ({ className = '', ...props }: ContainerProps) => (
  <div
    className={`grid grid-cols-[24px_1fr] items-center gap-x-2 hyphens-auto whitespace-pre-wrap ${className}`}
    {...props}
  />
);

interface ContentProps {
  className?: string;
  children?: React.ReactNode;
}

export const Content = ({ className = '', ...props }: ContentProps) => (
  <VStack gap="space-8" className={className} {...props} />
);

export const StyledCloseButton = ({ className = '', ...props }: ButtonProps) => (
  <Button className={`absolute top-0 right-0 text-ax-text-neutral ${className}`} {...props} />
);

const getBackgroundClass = (type: ToastType): string => {
  switch (type) {
    case ToastType.SUCCESS:
      return 'bg-ax-bg-success-soft';
    case ToastType.ERROR:
      return 'bg-ax-bg-danger-soft';
    case ToastType.INFO:
      return 'bg-ax-bg-info-soft';
    case ToastType.WARNING:
      return 'bg-ax-bg-warning-soft';
  }
};

const getBorderColorClass = (type: ToastType): string => {
  switch (type) {
    case ToastType.SUCCESS:
      return 'border-ax-bg-success-strong';
    case ToastType.ERROR:
      return 'border-ax-bg-danger-strong';
    case ToastType.INFO:
      return 'border-ax-bg-info-strong';
    case ToastType.WARNING:
      return 'border-ax-bg-warning-strong';
  }
};

const getAfterBgColor = (type: ToastType) => {
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

interface BaseToastProps extends HTMLAttributes<HTMLElement> {
  type: ToastType;
  className?: string;
  children?: React.ReactNode;
}

export const BaseToastStyle = forwardRef<HTMLElement, BaseToastProps>(
  ({ type, className = '', children, ...props }, ref) => (
    <VStack
      as="section"
      ref={ref}
      className={`relative w-75 rounded border p-4 text-ax-text-neutral ${getBackgroundClass(type)} ${getBorderColorClass(type)} ${className}`}
      {...props}
    >
      {children}
    </VStack>
  ),
);

BaseToastStyle.displayName = 'BaseToastStyle';

interface TimedToastProps extends HTMLAttributes<HTMLElement> {
  type: ToastType;
  paused: boolean;
  timeout: number;
  className?: string;
  children?: React.ReactNode;
}

export const TimedToastStyle = forwardRef<HTMLElement, TimedToastProps>(
  ({ type, paused, timeout, className = '', children, ...props }, ref) => {
    const customStyle: CSSProperties = {
      '--toast-after-bg': getAfterBgColor(type),
      '--toast-timer-duration': `${timeout - SLIDE_DURATION}ms`,
    } as CSSProperties;

    return (
      <VStack
        as="section"
        ref={ref}
        className={`relative w-75 rounded border p-4 text-ax-text-neutral ${getBackgroundClass(type)} ${getBorderColorClass(type)} animate-forwards animate-slide-in after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:origin-left after:animate-forwards after:animate-linear after:animate-once after:animate-timer after:bg-(--toast-after-bg) after:content-[''] ${paused ? 'after:animate-paused' : 'after:animate-play'} ${className}`}
        style={customStyle}
        {...props}
      >
        {children}
      </VStack>
    );
  },
);

TimedToastStyle.displayName = 'TimedToastStyle';
