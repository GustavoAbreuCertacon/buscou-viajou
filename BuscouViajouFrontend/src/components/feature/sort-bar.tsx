'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils/cn';

export type SortKey = 'relevant' | 'price-asc' | 'price-desc' | 'rating-desc';

const OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'relevant',     label: 'Mais relevante' },
  { value: 'price-asc',    label: 'Menor preço' },
  { value: 'price-desc',   label: 'Maior preço' },
  { value: 'rating-desc',  label: 'Melhor avaliação' },
];

interface Props {
  value: SortKey;
  onChange: (v: SortKey) => void;
  /** Total de resultados pra mostrar à esquerda */
  totalCount?: number;
  className?: string;
}

export function SortBar({ value, onChange, totalCount, className }: Props) {
  return (
    <div className={cn('flex items-center justify-between gap-bv-3', className)}>
      {totalCount !== undefined && (
        <p className="text-body text-bv-navy">
          <span className="font-bold tabular-nums">{totalCount}</span>{' '}
          {totalCount === 1 ? 'veículo disponível' : 'veículos disponíveis'}
        </p>
      )}
      <div className="flex items-center gap-bv-2 ml-auto">
        <span className="hidden md:inline text-body-sm text-bv-navy/72">Ordenar:</span>
        <Select value={value} onValueChange={(v) => onChange(v as SortKey)}>
          <SelectTrigger className="min-w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/** Aplica o sort sobre uma lista de QuoteResultItem */
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
      // Score: rating * 20 - price/100 (favorece bom rating e preço acessível)
      return arr.sort(
        (a, b) =>
          b.averageRating * 20 - b.pricing.finalPrice / 100 -
          (a.averageRating * 20 - a.pricing.finalPrice / 100),
      );
  }
}
