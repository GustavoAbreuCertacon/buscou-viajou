'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import { api, ApiError } from '@/lib/api/client';
import {
  VehicleResultCard,
  FiltersSidebar,
  applyFilters,
  defaultFilters,
  SortBar,
  sortResults,
  type FiltersState,
  type SortKey,
} from '@/components/feature';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import type { QuoteSearchResponse, QuoteSearchInput } from '@/lib/api/types';

interface Props {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export function SearchResults({ origin, destination, date, passengers }: Props) {
  const body: QuoteSearchInput = {
    origin,
    destination,
    departureDate: new Date(`${date}T08:00:00-03:00`).toISOString(),
    passengers,
  };

  const { data, isLoading, error } = useQuery<QuoteSearchResponse>({
    queryKey: ['quotes', origin, destination, date, passengers],
    queryFn: () => api<QuoteSearchResponse>('/v1/quotes', { method: 'POST', body, auth: false }),
    staleTime: 5 * 60_000,
  });

  const [filters, setFilters] = React.useState<FiltersState | null>(null);
  const [sort, setSort] = React.useState<SortKey>('relevant');
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  // Inicializa filtros quando os dados carregam
  React.useEffect(() => {
    if (data?.data && !filters) {
      setFilters(defaultFilters(data.data));
    }
  }, [data?.data, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-bv-5">
        <Skeleton className="h-[600px]" />
        <div className="space-y-bv-4">
          <Skeleton shape="text" className="w-1/3 h-6" />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[180px]" />
          ))}
        </div>
      </div>
    );
  }

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
      <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center max-w-2xl mx-auto">
        <BicolorHeading as="h2" size="h2" navy="Não achamos" green="veículos." />
        <p className="mt-bv-3 text-body text-bv-navy/72">
          Pra essa rota e data não encontramos opções disponíveis. Que tal tentar uma data próxima?
        </p>
      </div>
    );
  }

  const safeFilters = filters ?? defaultFilters(allResults);
  const visible = sortResults(applyFilters(allResults, safeFilters), sort);

  return (
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

      <div className="space-y-bv-4">
        {/* Header */}
        {meta && (
          <div className="flex items-center justify-between gap-bv-3 flex-wrap">
            <p className="text-body text-bv-navy">
              <span className="font-medium">{meta.origin.name}</span>{' '}
              <span className="text-bv-navy/48">→</span>{' '}
              <span className="font-medium">{meta.destination.name}</span>
              <span className="text-bv-navy/72 ml-bv-2">
                · {meta.distanceKm} km · ~{meta.estimatedDurationHours.toFixed(1)}h
              </span>
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-bv-3">
          {/* Mobile filters trigger */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
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
                onChange={(f) => {
                  setFilters(f);
                }}
                className="border-0 p-0 mt-bv-3"
              />
            </SheetContent>
          </Sheet>

          <SortBar value={sort} onChange={setSort} totalCount={visible.length} />
        </div>

        {/* Lista */}
        {visible.length === 0 ? (
          <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center">
            <p className="text-body text-bv-navy/72">
              Nenhum veículo combina com seus filtros.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-bv-3"
              onClick={() => setFilters(defaultFilters(allResults))}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="space-y-bv-4">
            {visible.map((r) => (
              <VehicleResultCard key={r.vehicleId} result={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
