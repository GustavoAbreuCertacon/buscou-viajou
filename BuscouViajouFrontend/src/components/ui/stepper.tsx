'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Stepper — incremento/decremento numérico (passageiros, etc.)
 * design-dna.json → componentRules.inputs (Stepper é variação de input)
 */
export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  /** Texto pequeno explicativo, ex: "passageiros" */
  unitLabel?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  label,
  unitLabel,
  className,
  ariaLabel,
  disabled,
}: StepperProps) {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  return (
    <div className={cn('inline-flex flex-col gap-bv-1', className)}>
      {label && (
        <span className="text-body-sm font-semibold text-bv-navy">{label}</span>
      )}
      <div className="inline-flex items-center bg-white rounded-bv-md border border-bv-navy/16 h-11 min-h-[44px]">
        <button
          type="button"
          onClick={decrement}
          disabled={!canDecrement}
          className={cn(
            'h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-l-bv-md',
            'text-bv-navy transition-colors duration-bv-fast',
            'focus-visible:outline-none focus-visible:shadow-bv-focus focus-visible:relative',
            canDecrement
              ? 'hover:bg-bv-navy-50 active:bg-bv-navy-100'
              : 'opacity-40 cursor-not-allowed',
          )}
          aria-label={`Diminuir ${ariaLabel ?? unitLabel ?? 'valor'}`}
        >
          <Minus className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <div
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={ariaLabel ?? label ?? unitLabel ?? 'valor'}
          className="min-w-[3rem] px-bv-3 text-center text-body font-semibold text-bv-navy tabular-nums"
        >
          {value}
        </div>
        <button
          type="button"
          onClick={increment}
          disabled={!canIncrement}
          className={cn(
            'h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-r-bv-md',
            'text-bv-navy transition-colors duration-bv-fast',
            'focus-visible:outline-none focus-visible:shadow-bv-focus focus-visible:relative',
            canIncrement
              ? 'hover:bg-bv-navy-50 active:bg-bv-navy-100'
              : 'opacity-40 cursor-not-allowed',
          )}
          aria-label={`Aumentar ${ariaLabel ?? unitLabel ?? 'valor'}`}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
      {unitLabel && (
        <span className="text-caption text-bv-navy/72">{unitLabel}</span>
      )}
    </div>
  );
}
