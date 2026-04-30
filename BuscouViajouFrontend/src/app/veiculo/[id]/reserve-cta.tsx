'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bus, Users, Info, ArrowRight } from 'lucide-react';
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
 * Sidebar de preço + CTA "Solicitar orçamento".
 * Modelo de negócio: comparador puro. A Buscou Viajou não fecha a reserva —
 * encaminha o lead pra empresa parceira finalizar diretamente.
 *
 * Fluxo:
 *  - Anônimo → salva intent + login com magic link
 *  - Logado sem cotação travada (entrou direto na URL) → volta pra busca
 *    (precisa data + passageiros pra empresa cotar de verdade)
 *  - Logado com cotação travada (Fase 2) → POST de lead pro CRM da empresa
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
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'pendingBookingIntent',
          JSON.stringify({ vehicleId, model, companyName, capacity, finalPrice, ts: Date.now() }),
        );
      }
      router.push(`/login?next=/veiculo/${vehicleId}`);
      return;
    }
    toast.info('Falta a cotação', {
      description:
        'Volte à busca informando data e passageiros — assim a empresa cota com precisão e você é conectado(a) com ela.',
      action: {
        label: 'Ir pra busca',
        onClick: () => router.push('/busca'),
      },
    });
  }

  return (
    <div className="rounded-bv-lg bg-white border border-bv-navy/12 shadow-bv-md p-bv-5 space-y-bv-4">
      <div>
        <p className="font-heading font-black text-h1 text-bv-navy tabular-nums leading-none">
          {formatCurrency(finalPrice)}
        </p>
        <p className="mt-bv-1 text-body-sm text-bv-navy/72">
          estimativa · {distanceKm ?? '—'} km · valor final é confirmado pela empresa
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

      <Button
        variant="accent"
        size="lg"
        fullWidth
        onClick={handleReserve}
        iconRight={<ArrowRight className="h-4 w-4" />}
      >
        Solicitar orçamento
      </Button>

      <p className="flex items-start gap-bv-2 text-caption text-bv-navy/72 leading-relaxed">
        <Info size={14} strokeWidth={2.5} className="text-bv-green shrink-0 mt-0.5" aria-hidden />
        <span>
          A reserva e o pagamento são finalizados <strong className="text-bv-navy">direto com {companyName}</strong>.
          A Buscou Viajou conecta vocês.
        </span>
      </p>

      <ul className="space-y-bv-2 text-body-sm text-bv-navy/72 pt-bv-3 border-t border-bv-navy/8">
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
