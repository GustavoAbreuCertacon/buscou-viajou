'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Bus, Clock as ClockIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { PricingBadge } from './pricing-badge';
import { AmenityGrid } from './amenity-grid';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  pluralCapacity,
  VEHICLE_TYPE_LABEL,
} from '@/lib/utils/format';
import type { QuoteResultItem } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  result: QuoteResultItem;
  /** href do detalhe (default: /veiculo/[vehicleId]) */
  href?: string;
  className?: string;
}

/**
 * VehicleResultCard — card de veículo em /busca (PRD §6.10).
 * Comparação tipo Trivago: foto, badges, info, preço destacado.
 */
export function VehicleResultCard({ result, href, className }: Props) {
  const detailHref = href ?? `/veiculo/${result.vehicleId}`;
  const photo = result.photos[0];
  const showOriginalPrice =
    result.pricing.multiplier !== 1.0 && result.pricing.basePrice !== result.pricing.finalPrice;

  return (
    <Card
      variant="interactive"
      padding="none"
      data-testid="vehicle-result-card"
      className={cn(
        'flex flex-col md:flex-row overflow-hidden group',
        'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      {/* Foto */}
      <div className="relative w-full md:w-[280px] aspect-[16/10] md:aspect-auto md:h-auto shrink-0 bg-bv-navy-50 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={result.model}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover transition-transform duration-bv-slow group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-bv-navy/24">
            <Bus className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-bv-3 left-bv-3">
          <PricingBadge
            indicator={result.pricing.indicator}
            multiplier={result.pricing.multiplier}
            size="sm"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col md:flex-row md:items-stretch flex-1 p-bv-5 gap-bv-5">
        <div className="flex-1 flex flex-col gap-bv-3 min-w-0">
          <div className="flex items-start justify-between gap-bv-3">
            <div className="min-w-0">
              <Badge variant="neutral" size="sm" className="mb-bv-2">
                {VEHICLE_TYPE_LABEL[result.vehicleType]} · {pluralCapacity(result.capacity)}
              </Badge>
              <h3 className="font-heading font-bold text-h4 text-bv-navy leading-snug truncate">
                {result.model}
              </h3>
              <div className="mt-bv-1 flex items-center gap-bv-2 text-body-sm text-bv-navy/72">
                <span className="font-medium text-bv-navy">{result.company.name}</span>
                <span aria-hidden>·</span>
                <StarRating
                  value={result.averageRating}
                  size="sm"
                  showValue
                  count={result.totalReviews}
                />
              </div>
            </div>
          </div>

          <AmenityGrid amenities={result.amenities} variant="inline" inlineLimit={5} />

          <div className="mt-auto flex items-center gap-bv-4 text-body-sm text-bv-navy/72">
            <span className="inline-flex items-center gap-1">
              <Users size={14} strokeWidth={2} aria-hidden />
              <span className="tabular-nums">{result.capacity}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon size={14} strokeWidth={2} aria-hidden />
              {formatDuration(result.route.estimatedDurationHours)}
            </span>
            <span>{formatDistance(result.route.distanceKm)}</span>
          </div>
        </div>

        {/* Coluna de preço */}
        <div className="md:w-[200px] md:border-l md:border-bv-navy/8 md:pl-bv-5 flex flex-row md:flex-col justify-between md:justify-center items-start md:items-end gap-bv-3">
          <div className="md:text-right">
            {showOriginalPrice && (
              <p className="text-body-sm text-bv-navy/48 line-through tabular-nums">
                {formatCurrency(result.pricing.basePrice)}
              </p>
            )}
            <p className="font-heading font-bold text-h2 text-bv-navy tabular-nums leading-none">
              {formatCurrency(result.pricing.finalPrice)}
            </p>
            <p className="mt-bv-1 text-caption text-bv-navy/72">total da viagem</p>
          </div>
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1 text-body-sm font-semibold text-bv-green hover:text-bv-green-700 transition-colors duration-bv-fast"
          >
            Ver detalhes
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
