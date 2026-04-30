'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * StarRating — display ou interativo (1-5 estrelas).
 * design-dna.json → componentRules (parte de avaliações)
 */
export interface StarRatingProps {
  value: number;
  /** Se passar, vira interativo. Se omitir, é display-only. */
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
  /** Mostra número ao lado das estrelas */
  showValue?: boolean;
  /** Mostra contagem de avaliações ao lado, ex: "(48)" */
  count?: number;
}

const SIZE = {
  sm: { px: 14, gap: 'gap-0.5' },
  md: { px: 20, gap: 'gap-1' },
  lg: { px: 28, gap: 'gap-1' },
};

export function StarRating({
  value,
  onChange,
  size = 'md',
  className,
  ariaLabel,
  showValue = false,
  count,
}: StarRatingProps) {
  const interactive = !!onChange;
  const [hover, setHover] = React.useState<number | null>(null);
  const display = hover ?? value;
  const sizeMeta = SIZE[size];

  return (
    <div className={cn('inline-flex items-center', className)}>
      <div
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={ariaLabel ?? `${value} de 5 estrelas`}
        className={cn('inline-flex items-center', sizeMeta.gap)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= Math.floor(display);
          const halfFilled = !filled && n <= display;
          if (!interactive) {
            return (
              <Star
                key={n}
                size={sizeMeta.px}
                className={cn(
                  filled || halfFilled
                    ? 'fill-bv-green text-bv-green'
                    : 'fill-bv-navy/8 text-bv-navy/16',
                )}
                strokeWidth={1.5}
                aria-hidden
              />
            );
          }
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
              onClick={() => onChange?.(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(null)}
              className="rounded-bv-sm transition-transform duration-bv-fast focus-visible:outline-none focus-visible:shadow-bv-focus hover:scale-110"
            >
              <Star
                size={sizeMeta.px}
                className={cn(
                  filled
                    ? 'fill-bv-green text-bv-green'
                    : 'fill-transparent text-bv-navy/24 hover:text-bv-green',
                )}
                strokeWidth={1.5}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-bv-2 text-body-sm font-semibold text-bv-navy tabular-nums">
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="ml-bv-1 text-body-sm text-bv-navy/72 tabular-nums">
          ({count})
        </span>
      )}
    </div>
  );
}
