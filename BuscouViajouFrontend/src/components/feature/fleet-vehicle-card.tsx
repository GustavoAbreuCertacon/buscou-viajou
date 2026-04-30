import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bus, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { pluralCapacity, VEHICLE_TYPE_LABEL } from '@/lib/utils/format';

interface Props {
  id: string;
  model: string;
  vehicleType: 'BUS' | 'MINIBUS' | 'VAN';
  capacity: number;
  averageRating: number;
  totalReviews: number;
  photos: string[];
}

export function FleetVehicleCard({
  id,
  model,
  vehicleType,
  capacity,
  averageRating,
  totalReviews,
  photos,
}: Props) {
  const photo = photos[0];

  return (
    <Card variant="interactive" padding="none" className="overflow-hidden flex flex-col h-full">
      <div className="relative w-full aspect-[16/10] bg-bv-navy-50 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={model}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-bv-slow hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-bv-navy/24">
            <Bus className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-bv-3 left-bv-3">
          <Badge variant="neutral" size="sm">
            {VEHICLE_TYPE_LABEL[vehicleType]}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-bv-3 p-bv-4 flex-1">
        <div className="min-w-0">
          <h3 className="font-heading font-bold text-h4 text-bv-navy leading-snug truncate">
            {model}
          </h3>
          <div className="mt-bv-1 flex items-center gap-bv-2 text-body-sm text-bv-navy/72">
            <span className="inline-flex items-center gap-1">
              <Users size={14} strokeWidth={2} className="text-bv-navy/48" />
              {pluralCapacity(capacity)}
            </span>
            <span aria-hidden>·</span>
            <StarRating value={averageRating} size="sm" showValue count={totalReviews} />
          </div>
        </div>

        <Link
          href={`/veiculo/${id}`}
          className="mt-auto inline-flex items-center gap-1 text-body-sm font-semibold text-bv-green hover:text-bv-green-700 transition-colors duration-bv-fast"
        >
          Ver detalhes
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </Card>
  );
}
