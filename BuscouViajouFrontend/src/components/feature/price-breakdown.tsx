'use client';

import * as React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { formatCurrency, formatDistance } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface Props {
  basePrice: number;
  multiplier: number;
  finalPrice: number;
  /** Distância total em km (já considerando garagem→cliente→destino→garagem). */
  distanceKm?: number | null;
  /** Custo de saída mínima cobrado pela empresa */
  minDepartureCost?: number | null;
  /** Valor por km do veículo */
  pricePerKm?: number | null;
  /** Adicionais selecionados (ex: guia turístico, cooler) */
  addons?: Array<{ name: string; quantity: number; totalPrice: number }>;
  className?: string;
}

/**
 * PriceBreakdown — accordion expansível mostrando como o preço foi calculado.
 * PRD §6.11 Seção 2 + RN-PRICE-001/002.
 *
 * Fórmula: MAX(min_departure_cost, distance_km × price_per_km) × multiplier + Σ adicionais
 */
export function PriceBreakdown({
  basePrice,
  multiplier,
  finalPrice,
  distanceKm,
  minDepartureCost,
  pricePerKm,
  addons = [],
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const showsMultiplier = Math.abs(multiplier - 1) > 0.01;
  const computedKm =
    distanceKm != null && pricePerKm != null ? distanceKm * pricePerKm : null;
  const usesMinCost =
    minDepartureCost != null && computedKm != null && computedKm < minDepartureCost;

  return (
    <div className={cn('rounded-bv-md border border-bv-navy/12 bg-white', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full px-bv-4 py-bv-3 flex items-center justify-between gap-bv-2 text-body font-semibold text-bv-navy hover:bg-bv-navy-50 rounded-bv-md transition-colors duration-bv-fast focus-visible:outline-none focus-visible:shadow-bv-focus"
      >
        <span className="inline-flex items-center gap-bv-2">
          <Info size={16} strokeWidth={2} className="text-bv-navy/72" />
          Como esse preço é calculado?
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-bv-navy/72 transition-transform duration-bv-fast',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="px-bv-4 pb-bv-4 pt-bv-1 space-y-bv-2 border-t border-bv-navy/8">
          {distanceKm != null && pricePerKm != null && (
            <Row
              label={`Distância · ${formatDistance(distanceKm)} × ${formatCurrency(pricePerKm)}/km`}
              value={formatCurrency(computedKm!)}
              dim={usesMinCost}
            />
          )}
          {minDepartureCost != null && (
            <Row
              label="Custo de saída mínima"
              value={formatCurrency(minDepartureCost)}
              dim={!usesMinCost}
              hint={usesMinCost ? 'Aplicado por ser maior que o cálculo por km' : undefined}
            />
          )}
          {addons.map((a) => (
            <Row
              key={a.name}
              label={`${a.name}${a.quantity > 1 ? ` × ${a.quantity}` : ''}`}
              value={formatCurrency(a.totalPrice)}
            />
          ))}
          <Row
            label="Subtotal"
            value={formatCurrency(basePrice)}
            strong
          />
          {showsMultiplier && (
            <Row
              label={`Multiplicador dinâmico · ${multiplier}x`}
              value={`${multiplier > 1 ? '+' : ''}${formatCurrency(finalPrice - basePrice)}`}
              accent
            />
          )}
          <div className="pt-bv-2 border-t border-bv-navy/8 flex items-center justify-between gap-bv-3">
            <span className="text-body font-bold text-bv-navy">Total</span>
            <span className="text-h3 font-heading font-bold text-bv-navy tabular-nums">
              {formatCurrency(finalPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  accent,
  dim,
  hint,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
  dim?: boolean;
  hint?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-bv-3 text-body-sm',
        strong && 'font-semibold text-body',
        dim && 'opacity-48 line-through',
      )}
    >
      <span className={cn('text-bv-navy/80', strong && 'text-bv-navy')}>
        {label}
        {hint && (
          <span className="block text-caption text-bv-navy/72 italic mt-0.5">{hint}</span>
        )}
      </span>
      <span
        className={cn(
          'font-medium tabular-nums',
          accent && 'text-bv-warning',
          strong ? 'text-bv-navy' : 'text-bv-navy/80',
        )}
      >
        {value}
      </span>
    </div>
  );
}
