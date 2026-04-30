'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, GitCompare, Bus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import {
  formatCurrency,
  pluralCapacity,
  VEHICLE_TYPE_LABEL,
} from '@/lib/utils/format';
import type { QuoteResultItem } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  selected: QuoteResultItem[];
  onRemove: (vehicleId: string) => void;
  onClear: () => void;
  className?: string;
}

/**
 * CompareBar — barra flutuante quando o usuário marca ≥1 veículo pra comparar.
 * Click no botão "Comparar" → Sheet com tabela lado a lado.
 *
 * Limit: 3 veículos máx pra cabe­r visualmente. UI bloqueia 4º via card.
 */
export function CompareBar({ selected, onRemove, onClear, className }: Props) {
  const [open, setOpen] = React.useState(false);

  if (selected.length === 0) return null;

  return (
    <>
      <div
        role="region"
        aria-label="Comparação de veículos"
        className={cn(
          'fixed inset-x-0 bottom-0 z-40',
          'border-t border-bv-navy/12 bg-white shadow-bv-lg',
          'animate-in slide-in-from-bottom duration-300',
          className,
        )}
      >
        <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-3 flex items-center gap-bv-4">
          <div className="flex items-center gap-bv-3 flex-1 min-w-0">
            <div className="hidden sm:flex items-center -space-x-2">
              {selected.slice(0, 3).map((s) => (
                <span
                  key={s.vehicleId}
                  className="relative h-10 w-10 rounded-bv-pill border-2 border-white bg-bv-navy-50 overflow-hidden shrink-0"
                >
                  {s.photos[0] ? (
                    <Image
                      src={s.photos[0]}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <Bus className="h-4 w-4 text-bv-navy/48 m-auto mt-3" aria-hidden />
                  )}
                </span>
              ))}
            </div>
            <div className="min-w-0">
              <p className="font-heading font-bold text-body text-bv-navy">
                {selected.length === 1
                  ? '1 veículo selecionado'
                  : `${selected.length} veículos pra comparar`}
              </p>
              <p className="text-caption text-bv-navy/72 truncate">
                {selected.length < 2
                  ? 'Selecione pelo menos mais 1 pra comparar lado a lado'
                  : 'Pronto pra ver os detalhes lado a lado'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-bv-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={onClear}>
              Limpar
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="accent"
                  size="md"
                  iconLeft={<GitCompare className="h-4 w-4" />}
                  disabled={selected.length < 2}
                >
                  Comparar ({selected.length})
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-heading font-bold text-h3 text-bv-navy">
                    <span className="text-bv-green">Comparar</span> lado a lado
                  </SheetTitle>
                </SheetHeader>
                <CompareTable selected={selected} onRemove={onRemove} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Spacer pra não cobrir o último card da lista */}
      <div className="h-[80px]" aria-hidden />
    </>
  );
}

function CompareTable({
  selected,
  onRemove,
}: {
  selected: QuoteResultItem[];
  onRemove: (vehicleId: string) => void;
}) {
  // Reúne todas as comodidades únicas pra coluna esquerda do diff
  const allAmenities = Array.from(
    new Set(selected.flatMap((s) => s.amenities.map((a) => a.name))),
  );

  return (
    <div className="mt-bv-5 overflow-x-auto">
      <div
        className="grid gap-bv-4 min-w-fit"
        style={{
          gridTemplateColumns: `minmax(160px, 1fr) repeat(${selected.length}, minmax(220px, 1fr))`,
        }}
      >
        {/* Header row */}
        <div />
        {selected.map((v) => (
          <div key={v.vehicleId} className="relative">
            <button
              type="button"
              onClick={() => onRemove(v.vehicleId)}
              className="absolute -top-bv-2 -right-bv-2 z-10 h-7 w-7 inline-flex items-center justify-center rounded-bv-pill bg-white border border-bv-navy/12 text-bv-navy/72 hover:bg-bv-navy hover:text-white transition-colors duration-bv-fast"
              aria-label={`Remover ${v.model} da comparação`}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
            <div className="rounded-bv-md overflow-hidden bg-bv-navy-50 aspect-[16/10] relative">
              {v.photos[0] ? (
                <Image
                  src={v.photos[0]}
                  alt={v.model}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              ) : (
                <Bus className="h-12 w-12 text-bv-navy/24 m-auto mt-12" aria-hidden />
              )}
            </div>
            <p className="mt-bv-2 font-heading font-bold text-body text-bv-navy leading-snug">
              {v.model}
            </p>
            <p className="text-caption text-bv-navy/72">{v.company.name}</p>
          </div>
        ))}

        {/* Rows */}
        <Row label="Preço" />
        {selected.map((v) => (
          <Cell key={`p-${v.vehicleId}`} highlight>
            <span className="font-heading font-bold text-h3 text-bv-navy tabular-nums">
              {formatCurrency(v.pricing.finalPrice)}
            </span>
          </Cell>
        ))}

        <Row label="Tipo" />
        {selected.map((v) => (
          <Cell key={`t-${v.vehicleId}`}>{VEHICLE_TYPE_LABEL[v.vehicleType]}</Cell>
        ))}

        <Row label="Capacidade" />
        {selected.map((v) => (
          <Cell key={`c-${v.vehicleId}`}>{pluralCapacity(v.capacity)}</Cell>
        ))}

        <Row label="Avaliação" />
        {selected.map((v) => (
          <Cell key={`r-${v.vehicleId}`}>
            <StarRating value={v.averageRating} size="sm" showValue count={v.totalReviews} />
          </Cell>
        ))}

        <Row label="Distância" />
        {selected.map((v) => (
          <Cell key={`d-${v.vehicleId}`}>{v.route.distanceKm} km</Cell>
        ))}

        <Row label="Duração" />
        {selected.map((v) => (
          <Cell key={`du-${v.vehicleId}`}>~{v.route.estimatedDurationHours.toFixed(1)}h</Cell>
        ))}

        {/* Amenities differential */}
        {allAmenities.length > 0 && <Row label="Comodidades" />}
        {allAmenities.length > 0 &&
          selected.map((v) => (
            <Cell key={`am-${v.vehicleId}`}>
              <ul className="space-y-1 text-body-sm">
                {allAmenities.map((name) => {
                  const has = v.amenities.some((a) => a.name === name);
                  return (
                    <li
                      key={name}
                      className={cn(
                        'flex items-center gap-bv-2',
                        has ? 'text-bv-navy' : 'text-bv-navy/40',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'h-1.5 w-1.5 rounded-bv-pill shrink-0',
                          has ? 'bg-bv-green' : 'bg-bv-navy/24',
                        )}
                      />
                      {name}
                    </li>
                  );
                })}
              </ul>
            </Cell>
          ))}
      </div>

      <p className="mt-bv-6 text-caption text-bv-navy/72 text-center">
        A reserva é feita direto com cada empresa após a comparação.
      </p>
    </div>
  );
}

function Row({ label }: { label: string }) {
  return (
    <div className="flex items-center font-heading font-bold text-caption uppercase tracking-[0.14em] text-bv-navy/60 pt-bv-4 pb-bv-2 border-t border-bv-navy/8 col-span-1 sticky left-0 bg-white">
      {label}
    </div>
  );
}

function Cell({
  children,
  highlight,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-start pt-bv-4 pb-bv-2 border-t border-bv-navy/8 text-body text-bv-navy',
        highlight && 'font-heading',
      )}
    >
      {children}
    </div>
  );
}
