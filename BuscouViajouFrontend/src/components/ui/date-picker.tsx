'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import 'react-day-picker/style.css';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  error?: string | boolean;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
  className?: string;
  /** Override classes do botão-trigger (pra controlar altura/tipografia em variantes maiores) */
  triggerClassName?: string;
  /** Voice da marca: "Quando?", "Data de ida", etc. */
  ariaLabel?: string;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Quando?',
  error,
  disabled,
  fromDate,
  toDate,
  className,
  triggerClassName,
  ariaLabel,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const hasError = !!error;
  const errorText = typeof error === 'string' ? error : undefined;

  return (
    <div className="w-full">
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            aria-label={ariaLabel ?? placeholder}
            aria-invalid={hasError || undefined}
            className={cn(
              'flex h-11 min-h-[44px] w-full items-center gap-bv-2',
              'rounded-bv-md border bg-white px-bv-4',
              'text-body text-left font-body',
              'transition-all duration-bv-base ease-bv-ease',
              'focus:outline-none focus-visible:shadow-bv-focus',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              hasError
                ? 'border-bv-danger'
                : 'border-bv-navy/16 focus:border-bv-green data-[state=open]:border-bv-green',
              !value && 'text-bv-navy/48',
              value && 'text-bv-navy',
              className,
              triggerClassName,
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-bv-navy/72" />
            <span className="flex-1">
              {value ? format(value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : placeholder}
            </span>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className={cn(
              'z-50 rounded-bv-md border border-bv-navy/12 bg-white p-bv-3 shadow-bv-lg',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            )}
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(d) => {
                onChange?.(d);
                setOpen(false);
              }}
              startMonth={fromDate}
              endMonth={toDate}
              locale={ptBR}
              showOutsideDays
              components={{
                Chevron: ({ orientation, ...rest }) =>
                  orientation === 'left' ? (
                    <ChevronLeft className="h-4 w-4 text-bv-navy/72" {...rest} />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-bv-navy/72" {...rest} />
                  ),
              }}
              classNames={{
                root: 'bv-day-picker',
                month: 'space-y-bv-3',
                month_caption: 'flex items-center justify-center text-body font-semibold text-bv-navy py-bv-2',
                weekdays: 'flex',
                weekday: 'w-9 h-9 flex items-center justify-center text-caption font-semibold text-bv-navy/48 uppercase',
                week: 'flex',
                day: 'w-9 h-9 p-0 relative',
                day_button: cn(
                  'w-9 h-9 rounded-bv-sm text-body-sm text-bv-navy',
                  'transition-colors duration-bv-fast',
                  'hover:bg-bv-navy-50',
                  'focus-visible:outline-none focus-visible:shadow-bv-focus',
                ),
                today: 'font-bold text-bv-green',
                selected: '[&>button]:bg-bv-green [&>button]:text-white [&>button]:hover:bg-bv-green-600',
                outside: 'opacity-30',
                disabled: 'opacity-30 pointer-events-none',
                hidden: 'invisible',
                nav: 'flex items-center gap-bv-2 absolute top-bv-2 right-bv-2',
                button_previous: 'h-8 w-8 rounded-bv-sm flex items-center justify-center hover:bg-bv-navy-50 absolute left-bv-2 top-bv-2 z-10',
                button_next: 'h-8 w-8 rounded-bv-sm flex items-center justify-center hover:bg-bv-navy-50 absolute right-bv-2 top-bv-2 z-10',
              }}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {errorText && (
        <p className="mt-bv-1 text-body-sm text-bv-danger leading-snug">{errorText}</p>
      )}
    </div>
  );
}
