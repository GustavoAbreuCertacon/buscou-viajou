import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
  helperText?: string;
  /** Mostra contador de caracteres se maxLength estiver definido */
  showCounter?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, showCounter, maxLength, value, id, ...props }, ref) => {
    const hasError = !!error;
    const errorText = typeof error === 'string' ? error : undefined;
    const message = errorText ?? helperText;
    const messageId = id ? `${id}-message` : undefined;
    const length = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          value={value}
          maxLength={maxLength}
          aria-invalid={hasError || undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            'w-full bg-white text-bv-navy placeholder:text-bv-navy/48',
            'rounded-bv-md border px-bv-4 py-bv-3 min-h-[120px]',
            'text-body font-body resize-y',
            'transition-all duration-bv-base ease-bv-ease',
            'focus:outline-none focus-visible:shadow-bv-focus',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            hasError
              ? 'border-bv-danger focus:border-bv-danger'
              : 'border-bv-navy/16 focus:border-bv-green',
            className,
          )}
          {...props}
        />
        <div className="mt-bv-1 flex items-start justify-between gap-bv-3">
          <p
            id={messageId}
            className={cn(
              'text-body-sm leading-snug flex-1',
              hasError ? 'text-bv-danger' : 'text-bv-navy/72',
            )}
          >
            {message}
          </p>
          {showCounter && maxLength && (
            <span
              className={cn(
                'text-caption tabular-nums',
                length >= maxLength ? 'text-bv-danger' : 'text-bv-navy/48',
              )}
              aria-live="polite"
            >
              {length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
