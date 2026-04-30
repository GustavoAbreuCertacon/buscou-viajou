'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceBreakdown } from '@/components/feature';
import { formatCurrency, pluralCapacity } from '@/lib/utils/format';
import { toast } from '@/components/ui/toaster';

interface Props {
  vehicleId: string;
  model: string;
  companyName: string;
  capacity: number;
  finalPrice: number;
  basePrice: number;
  multiplier: number;
  pricePerKm?: number;
  minDepartureCost?: number;
  distanceKm?: number;
  isLoggedIn: boolean;
}

/**
 * Sidebar de preço + CTA "Solicitar reserva".
 * Em produção: gera lockedQuote → POST /v1/bookings → /reserva/[id]
 * Pra demo: salva intent no localStorage e redireciona.
 */
export function ReserveCta({
  vehicleId,
  model,
  companyName,
  capacity,
  finalPrice,
  basePrice,
  multiplier,
  pricePerKm,
  minDepartureCost,
  distanceKm,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  function handleReserve() {
    if (!isLoggedIn) {
      // Salva intent
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'pendingBookingIntent',
          JSON.stringify({ vehicleId, model, companyName, capacity, finalPrice, ts: Date.now() }),
        );
      }
      router.push(`/login?next=/veiculo/${vehicleId}`);
      return;
    }
    toast.info('Em breve', {
      description:
        'Pra concluir a reserva é preciso passar pela busca pra obter uma cotação travada. Volte a /busca e selecione esse veículo.',
    });
  }

  return (
    <div className="rounded-bv-lg bg-white border border-bv-navy/12 shadow-bv-md p-bv-5 space-y-bv-4">
      <div>
        <p className="font-heading font-black text-h1 text-bv-navy tabular-nums leading-none">
          {formatCurrency(finalPrice)}
        </p>
        <p className="mt-bv-1 text-body-sm text-bv-navy/72">
          total da viagem (estimado · {distanceKm ?? '—'} km)
        </p>
      </div>

      <PriceBreakdown
        basePrice={basePrice}
        multiplier={multiplier}
        finalPrice={finalPrice}
        distanceKm={distanceKm}
        pricePerKm={pricePerKm}
        minDepartureCost={minDepartureCost}
      />

      <Button variant="accent" size="lg" fullWidth onClick={handleReserve}>
        Solicitar reserva
      </Button>

      <ul className="space-y-bv-2 text-body-sm text-bv-navy/72">
        <li className="inline-flex items-center gap-2 w-full">
          <Bus size={14} className="text-bv-navy/48" />
          <span className="truncate">{model}</span>
        </li>
        <li className="inline-flex items-center gap-2">
          <Users size={14} className="text-bv-navy/48" />
          {pluralCapacity(capacity)}
        </li>
      </ul>
    </div>
  );
}
