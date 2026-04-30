'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Users,
  Bus,
  Clock as ClockIcon,
  Sparkles,
  TrendingDown,
  Star,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { StarRating } from '@/components/ui/star-rating';
import { PricingBadge } from './pricing-badge';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  pluralCapacity,
  VEHICLE_TYPE_LABEL,
} from '@/lib/utils/format';
import type { QuoteResultItem } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

export type DealFlag = 'best-price' | 'top-rated' | 'recommended';

const DEAL_META: Record<
  DealFlag,
  { label: string; icon: typeof Sparkles; bg: string; text: string }
> = {
  recommended: {
    label: 'Recomendado',
    icon: Sparkles,
    bg: 'bg-bv-navy',
    text: 'text-white',
  },
  'best-price': {
    label: 'Melhor preço',
    icon: TrendingDown,
    bg: 'bg-bv-green',
    text: 'text-white',
  },
  'top-rated': {
    label: 'Mais bem avaliado',
    icon: Star,
    bg: 'bg-[#E0A23B]',
    text: 'text-white',
  },
};

interface Props {
  result: QuoteResultItem;
  href?: string;
  /** Bandeira de destaque opcional — calculada pelo container */
  dealFlag?: DealFlag;
  /** Estado de seleção pra comparar (controlled) */
  selected?: boolean;
  /** Toggle do checkbox de comparar */
  onToggleSelect?: () => void;
  /** Desabilita seleção (atingiu limite) */
  selectDisabled?: boolean;
  className?: string;
}

/**
 * VehicleResultCard — premium rebuild para padrão Trivago/Booking.
 *
 * Hierarquia visual:
 *  - Foto 320px desktop com badge de fotos (se houver galeria) e PricingBadge
 *  - Deal flag (Recomendado / Melhor preço / Mais bem avaliado) topo da foto
 *  - Compare checkbox top-right (overlay sobre foto)
 *  - Conteúdo: empresa+rating em pill, model em h3, amenities ícones, métricas
 *  - Coluna de preço: estimativa em h2 + caption + CTA accent "Solicitar orçamento"
 *  - Hover: lift -2px, shadow-lg, border accent green/40
 */
export function VehicleResultCard({
  result,
  href,
  dealFlag,
  selected = false,
  onToggleSelect,
  selectDisabled = false,
  className,
}: Props) {
  const detailHref = href ?? `/veiculo/${result.vehicleId}`;
  const photo = result.photos[0];
  const hasGallery = result.photos.length > 1;
  const showOriginalPrice =
    result.pricing.multiplier !== 1.0 &&
    result.pricing.basePrice !== result.pricing.finalPrice;
  const deal = dealFlag ? DEAL_META[dealFlag] : null;

  return (
    <article
      data-testid="vehicle-result-card"
      className={cn(
        'group relative isolate flex flex-col md:flex-row overflow-hidden',
        'rounded-bv-md bg-white border border-bv-navy/12',
        'transition-all duration-bv-base ease-bv-ease',
        'hover:-translate-y-0.5 hover:shadow-bv-lg hover:border-bv-green/40',
        'focus-within:shadow-bv-lg focus-within:border-bv-green',
        'motion-reduce:hover:translate-y-0',
        selected && 'ring-2 ring-bv-green ring-offset-2 ring-offset-bv-bg',
        className,
      )}
    >
      {/* Foto */}
      <div className="relative w-full md:w-[320px] aspect-[16/10] md:aspect-auto md:h-auto shrink-0 bg-bv-navy-50 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={result.model}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition-transform duration-bv-slow group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-bv-navy/24">
            <Bus className="h-12 w-12" aria-hidden />
          </div>
        )}

        {/* Deal flag — topo esquerda */}
        {deal && (
          <span
            className={cn(
              'absolute top-bv-3 left-bv-3 inline-flex items-center gap-1 px-bv-3 py-1 rounded-bv-pill',
              'font-heading font-bold text-caption uppercase tracking-wider shadow-bv-md',
              deal.bg,
              deal.text,
            )}
          >
            <deal.icon size={12} strokeWidth={2.5} aria-hidden />
            {deal.label}
          </span>
        )}

        {/* PricingBadge — abaixo do deal flag, se relevante */}
        {!deal && (
          <div className="absolute top-bv-3 left-bv-3">
            <PricingBadge
              indicator={result.pricing.indicator}
              multiplier={result.pricing.multiplier}
              size="sm"
            />
          </div>
        )}

        {/* Photos count badge */}
        {hasGallery && (
          <span
            aria-hidden
            className="absolute bottom-bv-3 left-bv-3 inline-flex items-center gap-1 px-bv-2 py-1 rounded-bv-pill bg-bv-navy/72 backdrop-blur-sm text-white text-caption font-semibold"
          >
            <Camera size={12} strokeWidth={2.5} />
            +{result.photos.length}
          </span>
        )}

        {/* Compare checkbox — topo direita, overlay */}
        {onToggleSelect && (
          <label
            className={cn(
              'absolute top-bv-3 right-bv-3 z-20',
              'flex items-center gap-bv-2 px-bv-2 py-1 rounded-bv-pill',
              'bg-white/95 backdrop-blur-sm border border-bv-navy/12',
              'text-caption font-semibold text-bv-navy cursor-pointer',
              'hover:bg-white transition-colors duration-bv-fast',
              selectDisabled && !selected && 'opacity-60 cursor-not-allowed',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={selected}
              onCheckedChange={(c) => {
                if (selectDisabled && !selected) return;
                if (c !== !!selected) onToggleSelect();
              }}
              disabled={selectDisabled && !selected}
              aria-label={`Comparar ${result.model}`}
              className="h-4 w-4"
            />
            <span>Comparar</span>
          </label>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col md:flex-row md:items-stretch flex-1 p-bv-5 gap-bv-5 min-w-0">
        <div className="flex-1 flex flex-col gap-bv-3 min-w-0">
          {/* Empresa + rating */}
          <div className="flex items-center gap-bv-3 flex-wrap">
            <span className="inline-flex items-center px-bv-2 py-0.5 rounded-bv-pill bg-bv-navy text-white text-caption font-bold uppercase tracking-wider">
              {result.company.name}
            </span>
            <StarRating
              value={result.averageRating}
              size="sm"
              showValue
              count={result.totalReviews}
            />
          </div>

          {/* Modelo */}
          <h3 className="font-heading font-bold text-h3 text-bv-navy leading-snug">
            {result.model}
          </h3>

          {/* Tipo + capacidade */}
          <div className="flex items-center gap-bv-3 text-body-sm text-bv-navy/72 flex-wrap">
            <span className="inline-flex items-center gap-1 font-semibold text-bv-navy">
              {VEHICLE_TYPE_LABEL[result.vehicleType]}
            </span>
            <span aria-hidden className="text-bv-navy/24">·</span>
            <span className="inline-flex items-center gap-1">
              <Users size={14} strokeWidth={2} aria-hidden />
              {pluralCapacity(result.capacity)}
            </span>
            <span aria-hidden className="text-bv-navy/24">·</span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon size={14} strokeWidth={2} aria-hidden />
              {formatDuration(result.route.estimatedDurationHours)}
            </span>
            <span aria-hidden className="text-bv-navy/24">·</span>
            <span>{formatDistance(result.route.distanceKm)}</span>
          </div>

          {/* Comodidades como chips */}
          {result.amenities.length > 0 && (
            <ul
              className="mt-auto flex flex-wrap gap-bv-1"
              aria-label="Comodidades"
            >
              {result.amenities.slice(0, 4).map((a) => (
                <li
                  key={a.id}
                  className="inline-flex items-center px-bv-2 py-0.5 rounded-bv-pill bg-bv-bg text-body-sm text-bv-navy/80 font-medium"
                >
                  {a.name}
                </li>
              ))}
              {result.amenities.length > 4 && (
                <li className="inline-flex items-center px-bv-2 py-0.5 rounded-bv-pill bg-bv-bg text-body-sm text-bv-navy/72 font-semibold tabular-nums">
                  +{result.amenities.length - 4}
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Coluna de preço + CTA */}
        <div className="md:w-[200px] md:border-l md:border-bv-navy/8 md:pl-bv-5 flex flex-row md:flex-col justify-between md:justify-center items-stretch md:items-end gap-bv-3 shrink-0">
          <div className="md:text-right">
            <p className="text-caption uppercase tracking-wider font-bold text-bv-navy/60">
              estimativa
            </p>
            {showOriginalPrice && (
              <p className="text-body-sm text-bv-navy/48 line-through tabular-nums">
                {formatCurrency(result.pricing.basePrice)}
              </p>
            )}
            <p className="font-heading font-black text-h2 text-bv-navy tabular-nums leading-none">
              {formatCurrency(result.pricing.finalPrice)}
            </p>
            <p className="mt-bv-1 text-caption text-bv-navy/72">
              total da viagem
            </p>
          </div>
          <Button
            asChild
            variant="accent"
            size="md"
            iconRight={<ArrowRight className="h-4 w-4" />}
            className="md:w-full"
          >
            <Link href={detailHref}>Solicitar orçamento</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
