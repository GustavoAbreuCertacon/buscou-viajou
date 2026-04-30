'use client';

import { X } from 'lucide-react';
import type { FiltersState } from '../filters-sidebar';
import type { QuoteResultItem } from '@/lib/api/types';
import { formatCurrency, VEHICLE_TYPE_LABEL } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface Props {
  filters: FiltersState;
  results: QuoteResultItem[];
  defaultPriceMax: number;
  onChange: (next: FiltersState) => void;
  onClear: () => void;
  className?: string;
}

/**
 * AppliedFilters — chips removíveis dos filtros ativos no topo dos resultados.
 * Premium pattern de Trivago/Booking — usuário sempre sabe o que está aplicado
 * e pode tirar com 1 clique.
 */
export function AppliedFilters({
  filters,
  results,
  defaultPriceMax,
  onChange,
  onClear,
  className,
}: Props) {
  const chips: Array<{ key: string; label: string; remove: () => void }> = [];

  filters.vehicleTypes.forEach((t) => {
    chips.push({
      key: `type-${t}`,
      label: VEHICLE_TYPE_LABEL[t],
      remove: () =>
        onChange({
          ...filters,
          vehicleTypes: filters.vehicleTypes.filter((x) => x !== t),
        }),
    });
  });

  if (filters.priceRange[1] < defaultPriceMax) {
    chips.push({
      key: 'price',
      label: `até ${formatCurrency(filters.priceRange[1])}`,
      remove: () =>
        onChange({ ...filters, priceRange: [filters.priceRange[0], defaultPriceMax] }),
    });
  }

  if (filters.minRating > 0) {
    chips.push({
      key: 'rating',
      label: `${filters.minRating.toFixed(1)}★ ou mais`,
      remove: () => onChange({ ...filters, minRating: 0 }),
    });
  }

  filters.amenities.forEach((a) => {
    chips.push({
      key: `am-${a}`,
      label: a,
      remove: () =>
        onChange({ ...filters, amenities: filters.amenities.filter((x) => x !== a) }),
    });
  });

  filters.companies.forEach((id) => {
    const company = results.find((r) => r.company.id === id)?.company;
    if (!company) return;
    chips.push({
      key: `co-${id}`,
      label: company.name,
      remove: () =>
        onChange({ ...filters, companies: filters.companies.filter((x) => x !== id) }),
    });
  });

  if (chips.length === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-bv-2 flex-wrap rounded-bv-md bg-white border border-bv-navy/12 p-bv-3',
        className,
      )}
      aria-label="Filtros aplicados"
    >
      <span className="text-caption font-bold uppercase tracking-[0.14em] text-bv-navy/60 mr-bv-1">
        {chips.length} {chips.length === 1 ? 'filtro' : 'filtros'}
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="group inline-flex items-center gap-bv-1 px-bv-3 py-1 rounded-bv-pill bg-bv-navy-50 text-body-sm font-semibold text-bv-navy hover:bg-bv-navy hover:text-white transition-colors duration-bv-fast focus-visible:outline-none focus-visible:shadow-bv-focus"
          aria-label={`Remover filtro ${chip.label}`}
        >
          <span>{chip.label}</span>
          <X size={14} strokeWidth={2.5} aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="ml-auto text-body-sm font-semibold text-bv-green hover:text-bv-green-700 underline underline-offset-4 focus-visible:outline-none focus-visible:rounded-bv-sm focus-visible:shadow-bv-focus px-bv-1"
      >
        Limpar todos
      </button>
    </div>
  );
}
