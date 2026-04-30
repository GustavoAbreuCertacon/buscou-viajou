'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, MapPin, Calendar, Users, Compass } from 'lucide-react';
import { api, ApiError } from '@/lib/api/client';
import {
  VehicleResultCard,
  FiltersSidebar,
  applyFilters,
  defaultFilters,
  type FiltersState,
} from '@/components/feature';
import type { DealFlag } from '@/components/feature/vehicle-result-card';
import { SortChips, sortResults, type SortKey } from '@/components/feature/search/sort-chips';
import { AppliedFilters } from '@/components/feature/search/applied-filters';
import { CompareBar } from '@/components/feature/search/compare-bar';
import {
  ResultCardSkeleton,
  FiltersSkeleton,
} from '@/components/feature/search/result-card-skeleton';
import { SectionEyebrow } from '@/components/feature/landing/section-eyebrow';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { formatDateLong } from '@/lib/utils/format';
import type { QuoteSearchResponse, QuoteSearchInput, QuoteResultItem } from '@/lib/api/types';

interface Props {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

const COMPARE_LIMIT = 3;

export function SearchResults({ origin, destination, date, passengers }: Props) {
  const body: QuoteSearchInput = {
    origin,
    destination,
    departureDate: new Date(`${date}T08:00:00-03:00`).toISOString(),
    passengers,
  };

  const { data, isLoading, error } = useQuery<QuoteSearchResponse>({
    queryKey: ['quotes', origin, destination, date, passengers],
    queryFn: () =>
      api<QuoteSearchResponse>('/v1/quotes', { method: 'POST', body, auth: false }),
    staleTime: 5 * 60_000,
  });

  const [filters, setFilters] = React.useState<FiltersState | null>(null);
  const [sort, setSort] = React.useState<SortKey>('relevant');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (data?.data && !filters) {
      setFilters(defaultFilters(data.data));
    }
  }, [data?.data, filters]);

  if (isLoading) return <LoadingState />;

  if (error) {
    const apiErr = error instanceof ApiError ? error : null;
    const isCityError = apiErr?.detail?.toLowerCase().includes('cidade');
    return (
      <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center max-w-2xl mx-auto">
        <BicolorHeading as="h2" size="h3" navy="Algo deu" green="errado." />
        <p className="mt-bv-3 text-body text-bv-navy/72">
          {isCityError
            ? 'Não encontramos essa cidade. Tente São Paulo, Rio, BH ou outra capital.'
            : apiErr?.detail ?? 'Tente novamente em instantes.'}
        </p>
        {apiErr?.errorId && (
          <p className="mt-bv-2 text-caption text-bv-navy/48 font-mono">
            Código: {apiErr.errorId.slice(0, 18)}
          </p>
        )}
      </div>
    );
  }

  const allResults = data?.data ?? [];
  const meta = data?.meta;

  if (allResults.length === 0) {
    return (
      <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-9 text-center max-w-2xl mx-auto">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-bv-pill bg-bv-navy-50 text-bv-navy mb-bv-5">
          <Compass className="h-10 w-10" strokeWidth={1.5} aria-hidden />
        </div>
        <BicolorHeading as="h2" size="h2">
          Não achamos <span className="text-bv-green">veículos.</span>
        </BicolorHeading>
        <p className="mt-bv-3 text-body text-bv-navy/72 max-w-md mx-auto">
          Pra essa rota e data não encontramos opções disponíveis. Tente uma
          data próxima ou volte pra home pra explorar outras rotas.
        </p>
      </div>
    );
  }

  const safeFilters = filters ?? defaultFilters(allResults);
  const defaultPriceMax = Math.ceil(
    Math.max(...allResults.map((r) => r.pricing.finalPrice), 1),
  );
  const filtered = applyFilters(allResults, safeFilters);
  const visible = sortResults(filtered, sort);

  // Computa deal flags na lista filtrada
  const dealFlags = computeDealFlags(filtered);

  // Compare state
  const selectedItems = visible.filter((v) => selectedIds.has(v.vehicleId));

  function toggleSelect(vehicleId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(vehicleId)) {
        next.delete(vehicleId);
      } else {
        if (next.size >= COMPARE_LIMIT) return prev;
        next.add(vehicleId);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function removeFromSelection(vehicleId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(vehicleId);
      return next;
    });
  }

  return (
    <>
      {/* Hero da busca */}
      <header className="mb-bv-6 space-y-bv-3">
        <SectionEyebrow number="01" label="Resultados" />
        <BicolorHeading as="h1" size="h1">
          <span className="text-bv-green tabular-nums">
            {visible.length}
          </span>{' '}
          <span className="text-bv-navy">
            {visible.length === 1 ? 'veículo disponível' : 'veículos disponíveis'}
          </span>
        </BicolorHeading>
        {meta && (
          <ul
            className="flex flex-wrap items-center gap-x-bv-5 gap-y-bv-2 text-body-sm text-bv-navy/72"
            aria-label="Detalhes da busca"
          >
            <li className="inline-flex items-center gap-bv-2">
              <MapPin size={16} className="text-bv-green" strokeWidth={2.5} aria-hidden />
              <span>
                <span className="font-semibold text-bv-navy">{meta.origin.name}</span>
                <span aria-hidden className="mx-1 text-bv-navy/48">→</span>
                <span className="font-semibold text-bv-navy">{meta.destination.name}</span>
              </span>
            </li>
            <li className="inline-flex items-center gap-bv-2">
              <Calendar size={16} className="text-bv-green" strokeWidth={2.5} aria-hidden />
              <span className="font-semibold text-bv-navy">
                {date ? formatDateLong(`${date}T08:00:00`) : '—'}
              </span>
            </li>
            <li className="inline-flex items-center gap-bv-2">
              <Users size={16} className="text-bv-green" strokeWidth={2.5} aria-hidden />
              <span className="font-semibold text-bv-navy tabular-nums">
                {passengers} {passengers === 1 ? 'passageiro' : 'passageiros'}
              </span>
            </li>
            <li className="inline-flex items-center gap-bv-2">
              <span className="text-bv-navy/72">
                <span className="font-semibold text-bv-navy tabular-nums">
                  {meta.distanceKm} km
                </span>{' '}
                · ~{meta.estimatedDurationHours.toFixed(1)}h
              </span>
            </li>
          </ul>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-bv-5">
        {/* Sidebar desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-[180px]">
            <FiltersSidebar
              results={allResults}
              value={safeFilters}
              onChange={setFilters}
            />
          </div>
        </div>

        <div className="space-y-bv-4 min-w-0">
          {/* Toolbar: mobile filters + sort chips */}
          <div className="flex items-start lg:items-center justify-between gap-bv-3 flex-col lg:flex-row">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="md"
                  iconLeft={<SlidersHorizontal className="h-4 w-4" />}
                  className="lg:hidden"
                >
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <FiltersSidebar
                  results={allResults}
                  value={safeFilters}
                  onChange={setFilters}
                  hideHeader
                  className="border-0 p-0 mt-bv-3 shadow-none"
                />
              </SheetContent>
            </Sheet>

            <SortChips value={sort} onChange={setSort} className="flex-1 lg:flex-initial" />
          </div>

          {/* Applied filters chips */}
          <AppliedFilters
            filters={safeFilters}
            results={allResults}
            defaultPriceMax={defaultPriceMax}
            onChange={setFilters}
            onClear={() => setFilters(defaultFilters(allResults))}
          />

          {/* Lista */}
          {visible.length === 0 ? (
            <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center">
              <p className="text-body text-bv-navy">
                Nenhum veículo combina com seus filtros.
              </p>
              <Button
                variant="ghost"
                size="md"
                className="mt-bv-4"
                onClick={() => setFilters(defaultFilters(allResults))}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <ul className="space-y-bv-4" aria-label="Lista de veículos disponíveis">
              {visible.map((r) => (
                <li key={r.vehicleId}>
                  <VehicleResultCard
                    result={r}
                    dealFlag={dealFlags.get(r.vehicleId)}
                    selected={selectedIds.has(r.vehicleId)}
                    onToggleSelect={() => toggleSelect(r.vehicleId)}
                    selectDisabled={
                      selectedIds.size >= COMPARE_LIMIT &&
                      !selectedIds.has(r.vehicleId)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CompareBar
        selected={selectedItems}
        onRemove={removeFromSelection}
        onClear={clearSelection}
      />
    </>
  );
}

/**
 * computeDealFlags — atribui no máximo 1 deal por veículo,
 * com prioridade: recommended > best-price > top-rated.
 */
function computeDealFlags(results: QuoteResultItem[]): Map<string, DealFlag> {
  const flags = new Map<string, DealFlag>();
  if (results.length < 2) return flags;

  // Cheapest
  const cheapest = results.reduce((min, r) =>
    r.pricing.finalPrice < min.pricing.finalPrice ? r : min,
  );

  // Top-rated (com pelo menos 5 avaliações pra evitar outliers de poucos reviews)
  const ratedCandidates = results.filter((r) => r.totalReviews >= 5);
  const topRated =
    ratedCandidates.length > 0
      ? ratedCandidates.reduce((max, r) =>
          r.averageRating > max.averageRating ? r : max,
        )
      : null;

  // Recommended: maior score (rating × 20 - price/100), com rating ≥ 4
  const candidates = results.filter((r) => r.averageRating >= 4);
  const score = (r: QuoteResultItem) => r.averageRating * 20 - r.pricing.finalPrice / 100;
  const recommended =
    candidates.length > 0
      ? candidates.reduce((max, r) => (score(r) > score(max) ? r : max))
      : null;

  if (recommended && recommended.vehicleId !== cheapest.vehicleId) {
    flags.set(recommended.vehicleId, 'recommended');
  }
  flags.set(cheapest.vehicleId, 'best-price');
  if (topRated && !flags.has(topRated.vehicleId)) {
    flags.set(topRated.vehicleId, 'top-rated');
  }

  return flags;
}

function LoadingState() {
  return (
    <>
      <header className="mb-bv-6 space-y-bv-3">
        <div className="bv-skeleton h-4 w-32 rounded-bv-sm bg-bv-navy-50" aria-hidden />
        <div className="bv-skeleton h-10 w-2/3 rounded-bv-sm bg-bv-navy-50" aria-hidden />
        <div className="bv-skeleton h-5 w-1/2 rounded-bv-sm bg-bv-navy-50" aria-hidden />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-bv-5">
        <div className="hidden lg:block">
          <FiltersSkeleton />
        </div>
        <div className="space-y-bv-4">
          <div className="bv-skeleton h-12 w-full rounded-bv-pill bg-bv-navy-50" aria-hidden />
          {[0, 1, 2].map((i) => (
            <ResultCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
