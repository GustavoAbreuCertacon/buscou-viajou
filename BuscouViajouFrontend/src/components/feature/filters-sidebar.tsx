'use client';

import * as React from 'react';
import { Bus, Truck, Car } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { QuoteResultItem } from '@/lib/api/types';

export interface FiltersState {
  vehicleTypes: Array<'BUS' | 'MINIBUS' | 'VAN'>;
  priceRange: [number, number];
  minRating: number;
  amenities: string[];
  companies: string[];
}

interface Props {
  /** Lista de resultados pra inferir limites/contadores. */
  results: QuoteResultItem[];
  /** Estado atual dos filtros (controlled). */
  value: FiltersState;
  onChange: (state: FiltersState) => void;
  className?: string;
}

const TYPE_META = [
  { value: 'BUS' as const,     label: 'Ônibus',         Icon: Bus },
  { value: 'MINIBUS' as const, label: 'Micro-ônibus',   Icon: Truck },
  { value: 'VAN' as const,     label: 'Van',            Icon: Car },
];

const RATING_OPTIONS = [4.5, 4, 3];

export function defaultFilters(results: QuoteResultItem[]): FiltersState {
  const prices = results.map((r) => r.pricing.finalPrice);
  return {
    vehicleTypes: [],
    priceRange: [
      Math.min(...prices, 0),
      Math.max(...prices, 1),
    ],
    minRating: 0,
    amenities: [],
    companies: [],
  };
}

/**
 * FiltersSidebar — usado em /busca (sidebar desktop / sheet mobile).
 * Filtros aplicados client-side sobre a lista de quotes.
 */
export function FiltersSidebar({ results, value, onChange, className }: Props) {
  const allAmenities = React.useMemo(() => {
    const map = new Map<string, number>();
    results.forEach((r) =>
      r.amenities.forEach((a) => map.set(a.name, (map.get(a.name) ?? 0) + 1)),
    );
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [results]);

  const allCompanies = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    results.forEach((r) => {
      const existing = map.get(r.company.id);
      if (existing) existing.count++;
      else map.set(r.company.id, { id: r.company.id, name: r.company.name, count: 1 });
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [results]);

  const allPrices = results.map((r) => r.pricing.finalPrice);
  const priceMin = Math.floor(Math.min(...allPrices, 0));
  const priceMax = Math.ceil(Math.max(...allPrices, 1));

  const typeCounts = TYPE_META.reduce(
    (acc, t) => ({ ...acc, [t.value]: results.filter((r) => r.vehicleType === t.value).length }),
    {} as Record<string, number>,
  );

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  return (
    <aside
      className={cn(
        'rounded-bv-md bg-white border border-bv-navy/12 p-bv-5 space-y-bv-6',
        className,
      )}
      aria-label="Filtros de busca"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-h4 text-bv-navy">Filtros</h2>
        <Button
          variant="link"
          size="sm"
          onClick={() => onChange(defaultFilters(results))}
        >
          Limpar
        </Button>
      </header>

      {/* Tipo de veículo */}
      <section className="space-y-bv-3">
        <Label>Tipo de veículo</Label>
        <ul className="space-y-bv-2">
          {TYPE_META.map(({ value: v, label, Icon }) => (
            <li key={v} className="flex items-center justify-between gap-bv-2">
              <label className="flex items-center gap-bv-3 cursor-pointer flex-1 text-body text-bv-navy">
                <Checkbox
                  checked={value.vehicleTypes.includes(v)}
                  onCheckedChange={() =>
                    onChange({ ...value, vehicleTypes: toggle(value.vehicleTypes, v) })
                  }
                />
                <Icon size={18} className="text-bv-navy/72" strokeWidth={2} />
                <span>{label}</span>
              </label>
              <span className="text-caption text-bv-navy/48 tabular-nums">
                {typeCounts[v] ?? 0}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Faixa de preço */}
      <section className="space-y-bv-3">
        <Label>Faixa de preço</Label>
        <div className="space-y-bv-2">
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            value={value.priceRange[1]}
            onChange={(e) =>
              onChange({ ...value, priceRange: [priceMin, Number(e.target.value)] })
            }
            className="w-full accent-bv-green"
            aria-label="Preço máximo"
          />
          <div className="flex items-center justify-between text-body-sm text-bv-navy/72 tabular-nums">
            <span>{formatCurrency(priceMin)}</span>
            <span className="font-semibold text-bv-navy">
              até {formatCurrency(value.priceRange[1])}
            </span>
          </div>
        </div>
      </section>

      {/* Avaliação mínima */}
      <section className="space-y-bv-3">
        <Label>Avaliação mínima</Label>
        <ul className="space-y-bv-2">
          <li>
            <label className="flex items-center gap-bv-3 cursor-pointer text-body text-bv-navy">
              <Checkbox
                checked={value.minRating === 0}
                onCheckedChange={() => onChange({ ...value, minRating: 0 })}
              />
              <span>Qualquer avaliação</span>
            </label>
          </li>
          {RATING_OPTIONS.map((r) => (
            <li key={r}>
              <label className="flex items-center gap-bv-3 cursor-pointer text-body text-bv-navy">
                <Checkbox
                  checked={value.minRating === r}
                  onCheckedChange={() => onChange({ ...value, minRating: r })}
                />
                <StarRating value={r} size="sm" />
                <span className="text-body-sm">e acima</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Comodidades */}
      {allAmenities.length > 0 && (
        <section className="space-y-bv-3">
          <Label>Comodidades</Label>
          <ul className="space-y-bv-2">
            {allAmenities.slice(0, 8).map(([name, count]) => (
              <li key={name} className="flex items-center justify-between gap-bv-2">
                <label className="flex items-center gap-bv-3 cursor-pointer flex-1 text-body text-bv-navy">
                  <Checkbox
                    checked={value.amenities.includes(name)}
                    onCheckedChange={() =>
                      onChange({ ...value, amenities: toggle(value.amenities, name) })
                    }
                  />
                  <span>{name}</span>
                </label>
                <span className="text-caption text-bv-navy/48 tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Empresa */}
      {allCompanies.length > 1 && (
        <section className="space-y-bv-3">
          <Label>Empresa</Label>
          <ul className="space-y-bv-2 max-h-48 overflow-y-auto pr-bv-1">
            {allCompanies.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-bv-2">
                <label className="flex items-center gap-bv-3 cursor-pointer flex-1 text-body text-bv-navy min-w-0">
                  <Checkbox
                    checked={value.companies.includes(c.id)}
                    onCheckedChange={() =>
                      onChange({ ...value, companies: toggle(value.companies, c.id) })
                    }
                  />
                  <span className="truncate">{c.name}</span>
                </label>
                <span className="text-caption text-bv-navy/48 tabular-nums">{c.count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}

/**
 * Aplica filtros sobre a lista de results (client-side).
 */
export function applyFilters(results: QuoteResultItem[], f: FiltersState): QuoteResultItem[] {
  return results.filter((r) => {
    if (f.vehicleTypes.length && !f.vehicleTypes.includes(r.vehicleType)) return false;
    if (r.pricing.finalPrice > f.priceRange[1]) return false;
    if (f.minRating > 0 && r.averageRating < f.minRating) return false;
    if (f.amenities.length) {
      const names = r.amenities.map((a) => a.name);
      if (!f.amenities.every((a) => names.includes(a))) return false;
    }
    if (f.companies.length && !f.companies.includes(r.company.id)) return false;
    return true;
  });
}
