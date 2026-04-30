import * as React from 'react';
import Image from 'next/image';
import { Building2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { pluralReviews } from '@/lib/utils/format';

const STATUS_LABEL: Record<string, { label: string; variant: 'accent' | 'neutral' | 'warning' }> = {
  ACTIVE: { label: 'Empresa ativa', variant: 'accent' },
  INACTIVE: { label: 'Inativa', variant: 'neutral' },
  PENDING_APPROVAL: { label: 'Aguardando aprovação', variant: 'warning' },
  SUSPENDED: { label: 'Suspensa', variant: 'warning' },
};

interface Props {
  name: string;
  legalName?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  status: string;
  averageRating: number;
  totalReviews: number;
  operatingRegions?: string[] | null;
  city?: string | null;
  state?: string | null;
}

export function CompanyHeader({
  name,
  legalName,
  logoUrl,
  description,
  status,
  averageRating,
  totalReviews,
  operatingRegions,
  city,
  state,
}: Props) {
  const statusInfo = STATUS_LABEL[status] ?? { label: status, variant: 'neutral' as const };

  return (
    <section className="rounded-bv-lg bg-white shadow-bv-md p-bv-6 md:p-bv-7">
      <div className="flex flex-col md:flex-row md:items-start gap-bv-5">
        <div className="relative h-24 w-24 md:h-28 md:w-28 shrink-0 rounded-bv-md bg-bv-navy-50 overflow-hidden flex items-center justify-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`Logo ${name}`}
              fill
              sizes="112px"
              className="object-contain p-bv-2"
            />
          ) : (
            <Building2 className="h-10 w-10 text-bv-navy/24" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-bv-2">
          <div className="flex items-start justify-between gap-bv-3 flex-wrap">
            <div className="min-w-0">
              <BicolorHeading as="h1" size="h2">
                {name}
              </BicolorHeading>
              {legalName && legalName !== name && (
                <p className="mt-bv-1 text-body-sm text-bv-navy/72 truncate">{legalName}</p>
              )}
            </div>
            <Badge variant={statusInfo.variant} size="md">
              {statusInfo.label}
            </Badge>
          </div>

          <div className="flex items-center gap-bv-3 flex-wrap text-body-sm text-bv-navy/72">
            <StarRating value={averageRating} size="sm" showValue />
            <span aria-hidden>·</span>
            <span>{pluralReviews(totalReviews)}</span>
            {(city || state) && (
              <>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} strokeWidth={2} className="text-bv-navy/48" />
                  {[city, state].filter(Boolean).join(', ')}
                </span>
              </>
            )}
          </div>

          {description && (
            <p className="mt-bv-3 text-body text-bv-navy/80 leading-relaxed line-clamp-3">
              {description}
            </p>
          )}

          {operatingRegions && operatingRegions.length > 0 && (
            <div className="mt-bv-3 flex flex-wrap gap-bv-2">
              <span className="text-caption font-semibold text-bv-navy/72 uppercase tracking-wide">
                Atua em:
              </span>
              {operatingRegions.map((region) => (
                <Badge key={region} variant="outlineNavy" size="sm">
                  {region}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
