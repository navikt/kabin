import { type ComponentProps, forwardRef } from 'react';

interface Props extends ComponentProps<'button'> {
  open: boolean;
  minHeight?: string;
}

export const ToggleButton = forwardRef<HTMLButtonElement, Props>(
  ({ open, minHeight, className = '', style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`border-ax-border-neutral text-ax-text-neutral before:bg-ax-text-neutral after:bg-ax-text-neutral disabled:border-ax-border-neutral disabled:bg-ax-bg-neutral relative w-full cursor-pointer rounded border bg-transparent pr-7 pl-2 font-[Source_Sans_Pro,Arial,Helvetica,sans-serif] text-sm whitespace-nowrap transition-shadow duration-100 ease-in-out select-none before:absolute before:top-1/2 before:right-2 before:h-[1.5px] before:w-2 before:rounded-sm before:transition-transform before:duration-100 before:ease-in-out before:content-[''] after:absolute after:top-1/2 after:right-2 after:h-[1.5px] after:w-2 after:rounded-sm after:transition-transform after:duration-100 after:ease-in-out after:content-[''] focus:shadow-[0_0_0_3px_var(--ax-border-accent)] focus:outline-none active:shadow-[0_0_0_3px_var(--ax-border-accent)] active:outline-none disabled:cursor-not-allowed disabled:opacity-70 ${
          open
            ? 'before:-translate-x-[31%] before:-translate-y-1/2 before:-rotate-45 after:translate-x-[31%] after:-translate-y-1/2 after:rotate-45'
            : 'before:-translate-x-[31%] before:-translate-y-1/2 before:rotate-45 after:translate-x-[31%] after:-translate-y-1/2 after:-rotate-45'
        }
          ${className}
        `}
        style={{
          minHeight: minHeight ?? '2rem',
          ...style,
        }}
        {...props}
      />
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
