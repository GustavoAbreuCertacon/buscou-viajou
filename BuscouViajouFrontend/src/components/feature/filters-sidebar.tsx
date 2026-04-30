'use client';

import * as React from 'react';
import {
  Bus,
  Truck,
  Car,
  DollarSign,
  Star,
  Sparkles,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  results: QuoteResultItem[];
  value: FiltersState;
  onChange: (state: FiltersState) => void;
  className?: string;
  /** Esconder header (Filtros + Limpar). Útil quando vem dentro de Sheet com SheetTitle. */
  hideHeader?: boolean;
}

const TYPE_META = [
  { value: 'BUS' as const, label: 'Ônibus', Icon: Bus },
  { value: 'MINIBUS' as const, label: 'Micro-ônibus', Icon: Truck },
  { value: 'VAN' as const, label: 'Van', Icon: Car },
];

const RATING_OPTIONS = [4.5, 4, 3];

export function defaultFilters(results: QuoteResultItem[]): FiltersState {
  const prices = results.map((r) => r.pricing.finalPrice);
  return {
    vehicleTypes: [],
    priceRange: [Math.min(...prices, 0), Math.max(...prices, 1)],
    minRating: 0,
    amenities: [],
    companies: [],
  };
}

/** Quantos filtros estão ativos (pra contador no header). */
function countActive(f: FiltersState, defaultPriceMax: number): number {
  let n = 0;
  if (f.vehicleTypes.length) n += f.vehicleTypes.length;
  if (f.priceRange[1] < defaultPriceMax) n += 1;
  if (f.minRating > 0) n += 1;
  if (f.amenities.length) n += f.amenities.length;
  if (f.companies.length) n += f.companies.length;
  return n;
}

export function FiltersSidebar({
  results,
  value,
  onChange,
  className,
  hideHeader,
}: Props) {
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

  const [showAllAmenities, setShowAllAmenities] = React.useState(false);
  const visibleAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 6);
  const activeCount = countActive(value, priceMax);

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
      {!hideHeader && (
        <header className="flex items-center justify-between gap-bv-2">
          <div>
            <h2 className="font-heading font-bold text-h4 text-bv-navy">
              Filtros
            </h2>
            {activeCount > 0 && (
              <p className="text-caption font-semibold text-bv-green-700 tabular-nums">
                {activeCount} {activeCount === 1 ? 'aplicado' : 'aplicados'}
              </p>
            )}
          </div>
          {activeCount > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => onChange(defaultFilters(results))}
            >
              Limpar tudo
            </Button>
          )}
        </header>
      )}

      {/* Tipo de veículo */}
      <FilterSection icon={Bus} label="Tipo de veículo">
        <ul className="space-y-bv-2">
          {TYPE_META.map(({ value: v, label, Icon }) => (
            <li key={v} className="flex items-center justify-between gap-bv-2">
              <label className="flex items-center gap-bv-3 cursor-pointer flex-1 text-body text-bv-navy min-h-[28px]">
                <Checkbox
                  checked={value.vehicleTypes.includes(v)}
                  onCheckedChange={() =>
                    onChange({ ...value, vehicleTypes: toggle(value.vehicleTypes, v) })
                  }
                />
                <Icon size={18} className="text-bv-navy/72" strokeWidth={2} aria-hidden />
                <span>{label}</span>
              </label>
              <span className="text-caption text-bv-navy/48 tabular-nums">
                {typeCounts[v] ?? 0}
              </span>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Faixa de preço */}
      <FilterSection icon={DollarSign} label="Faixa de preço">
        <div className="space-y-bv-3">
          <div className="flex items-center justify-between text-body-sm tabular-nums">
            <span className="text-bv-navy/72">{formatCurrency(priceMin)}</span>
            <span className="font-heading font-bold text-bv-navy">
              até {formatCurrency(value.priceRange[1])}
            </span>
          </div>
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            value={value.priceRange[1]}
            onChange={(e) =>
              onChange({ ...value, priceRange: [priceMin, Number(e.target.value)] })
            }
            className="w-full h-2 rounded-bv-pill appearance-none cursor-pointer accent-bv-green bg-bv-navy/12 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-bv-pill [&::-webkit-slider-thumb]:bg-bv-green [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-bv-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-bv-pill [&::-moz-range-thumb]:bg-bv-green [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-bv-md"
            aria-label="Preço máximo"
          />
        </div>
      </FilterSection>

      {/* Avaliação como chips */}
      <FilterSection icon={Star} label="Avaliação mínima">
        <div className="flex flex-wrap gap-bv-2">
          <RatingChip
            label="Qualquer"
            active={value.minRating === 0}
            onClick={() => onChange({ ...value, minRating: 0 })}
          />
          {RATING_OPTIONS.map((r) => (
            <RatingChip
              key={r}
              label={`${r.toFixed(1)}★+`}
              active={value.minRating === r}
              onClick={() => onChange({ ...value, minRating: r })}
            />
          ))}
        </div>
      </FilterSection>

      {/* Comodidades */}
      {allAmenities.length > 0 && (
        <FilterSection icon={Sparkles} label="Comodidades">
          <ul className="space-y-bv-2">
            {visibleAmenities.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between gap-bv-2">
                <label className="flex items-center gap-bv-3 cursor-pointer flex-1 text-body text-bv-navy min-h-[28px]">
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
          {allAmenities.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllAmenities((p) => !p)}
              className="mt-bv-3 inline-flex items-center gap-1 text-body-sm font-semibold text-bv-green hover:text-bv-green-700 underline underline-offset-4 focus-visible:outline-none focus-visible:rounded-bv-sm focus-visible:shadow-bv-focus"
            >
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className={cn(
                  'transition-transform duration-bv-fast',
                  showAllAmenities && 'rotate-180',
                )}
                aria-hidden
              />
              {showAllAmenities
                ? 'Mostrar menos'
                : `Ver mais (${allAmenities.length - 6})`}
            </button>
          )}
        </FilterSection>
      )}

      {/* Empresa */}
      {allCompanies.length > 1 && (
        <FilterSection icon={Building2} label="Empresa">
          <ul className="space-y-bv-2 max-h-48 overflow-y-auto pr-bv-1">
            {allCompanies.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-bv-2">
                <label className="flex items-center gap-bv-3 cursor-pointer flex-1 text-body text-bv-navy min-w-0 min-h-[28px]">
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
        </FilterSection>
      )}
    </aside>
  );
}

interface FilterSectionProps {
  icon: typeof Bus;
  label: string;
  children: React.ReactNode;
}

function FilterSection({ icon: Icon, label, children }: FilterSectionProps) {
  return (
    <section className="space-y-bv-3">
      <Label className="flex items-center gap-bv-2 font-heading font-bold text-bv-navy text-body">
        <Icon size={16} strokeWidth={2} className="text-bv-green" aria-hidden />
        {label}
      </Label>
      {children}
    </section>
  );
}

interface RatingChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function RatingChip({ label, active, onClick }: RatingChipProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center min-h-[36px] px-bv-3 py-1 rounded-bv-pill border text-body-sm font-semibold tabular-nums',
        'transition-all duration-bv-fast',
        'focus-visible:outline-none focus-visible:shadow-bv-focus',
        active
          ? 'bg-bv-navy text-white border-bv-navy'
          : 'bg-white text-bv-navy border-bv-navy/16 hover:border-bv-navy/40 hover:bg-bv-navy-50',
      )}
    >
      {label}
    </button>
  );
}

/** Aplica filtros sobre a lista de results (client-side). */
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
