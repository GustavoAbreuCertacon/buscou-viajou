import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Input — design-dna.json → componentRules.inputs
 *
 * - 16px font (evita zoom iOS)
 * - radius 8px
 * - focus: borda verde + shadow-focus
 * - error: borda danger + mensagem abaixo
 * - placeholder navy/48 (low-key)
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Mostrado abaixo do input, em body-sm. Cor depende de `error`. */
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, iconLeft, iconRight, helperText, id, ...props }, ref) => {
    const hasError = !!error;
    const errorText = typeof error === 'string' ? error : undefined;
    const message = errorText ?? helperText;
    const messageId = id ? `${id}-message` : undefined;

    return (
      <div className="w-full">
        <div className="relative">
          {iconLeft && (
            <span className="absolute left-bv-3 top-1/2 -translate-y-1/2 text-bv-navy/48 pointer-events-none">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            aria-invalid={hasError || undefined}
            aria-describedby={message ? messageId : undefined}
            className={cn(
              'peer w-full bg-white text-bv-navy placeholder:text-bv-navy/48',
              'h-11 min-h-[44px] rounded-bv-md border',
              'text-body font-body',
              'transition-all duration-bv-base ease-bv-ease',
              'focus:outline-none focus-visible:shadow-bv-focus',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              iconLeft ? 'pl-10 pr-bv-4' : 'px-bv-4',
              iconRight && 'pr-10',
              hasError
                ? 'border-bv-danger focus:border-bv-danger'
                : 'border-bv-navy/16 focus:border-bv-green',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-bv-3 top-1/2 -translate-y-1/2 text-bv-navy/48 pointer-events-none">
              {iconRight}
            </span>
          )}
        </div>
        {message && (
          <p
            id={messageId}
            className={cn(
              'mt-bv-1 text-body-sm leading-snug',
              hasError ? 'text-bv-danger' : 'text-bv-navy/72',
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
