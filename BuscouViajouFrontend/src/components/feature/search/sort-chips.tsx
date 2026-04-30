'use client';

import { Sparkles, TrendingDown, TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type SortKey = 'relevant' | 'price-asc' | 'price-desc' | 'rating-desc';

const OPTIONS: Array<{
  value: SortKey;
  label: string;
  shortLabel: string;
  icon: typeof Sparkles;
}> = [
  { value: 'relevant',    label: 'Recomendado',     shortLabel: 'Recomendado',  icon: Sparkles },
  { value: 'price-asc',   label: 'Menor preço',     shortLabel: 'Menor preço',  icon: TrendingDown },
  { value: 'price-desc',  label: 'Maior preço',     shortLabel: 'Maior preço',  icon: TrendingUp },
  { value: 'rating-desc', label: 'Melhor avaliação', shortLabel: 'Melhor nota', icon: Star },
];

interface Props {
  value: SortKey;
  onChange: (v: SortKey) => void;
  className?: string;
}

/**
 * SortChips — substitui SortBar dropdown por grupo de chips visuais.
 * Estilo Trivago/Booking: cada opção com ícone, chip ativo destacado em navy.
 *
 * Mobile: scroll horizontal sem scrollbar.
 */
export function SortChips({ value, onChange, className }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Ordenar resultados"
      className={cn(
        'flex gap-bv-2 overflow-x-auto -mx-bv-3 px-bv-3 pb-bv-1',
        'md:overflow-visible md:mx-0 md:px-0 md:pb-0 md:flex-wrap',
        '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {OPTIONS.map(({ value: v, label, shortLabel, icon: Icon }) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={cn(
              'shrink-0 inline-flex items-center gap-bv-2 min-h-[44px] px-bv-4 py-bv-2',
              'rounded-bv-pill border text-body-sm font-semibold',
              'transition-all duration-bv-base ease-bv-ease',
              'focus-visible:outline-none focus-visible:shadow-bv-focus',
              active
                ? 'bg-bv-navy text-white border-bv-navy shadow-bv-md'
                : 'bg-white text-bv-navy border-bv-navy/12 hover:bg-bv-navy-50 hover:border-bv-navy/24',
            )}
          >
            <Icon
              size={16}
              strokeWidth={2.5}
              className={active ? 'text-bv-green-300' : 'text-bv-navy/60'}
              aria-hidden
            />
            <span className="md:inline">{shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Aplica o sort sobre uma lista (compatível com SortBar). */
export function sortResults<T extends { pricing: { finalPrice: number }; averageRating: number }>(
  results: T[],
  key: SortKey,
): T[] {
  const arr = [...results];
  switch (key) {
    case 'price-asc':
      return arr.sort((a, b) => a.pricing.finalPrice - b.pricing.finalPrice);
    case 'price-desc':
      return arr.sort((a, b) => b.pricing.finalPrice - a.pricing.finalPrice);
    case 'rating-desc':
      return arr.sort((a, b) => b.averageRating - a.averageRating);
    case 'relevant':
    default:
      return arr.sort(
        (a, b) =>
          b.averageRating * 20 -
          b.pricing.finalPrice / 100 -
          (a.averageRating * 20 - a.pricing.finalPrice / 100),
      );
  }
}
