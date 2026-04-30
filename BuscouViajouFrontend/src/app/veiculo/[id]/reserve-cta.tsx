'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bus, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stepper } from '@/components/ui/stepper';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PriceBreakdown } from '@/components/feature';
import { formatCurrency, pluralCapacity } from '@/lib/utils/format';
import { toast } from '@/components/ui/toaster';
import { api, ApiError } from '@/lib/api/client';
import type { QuoteSearchResponse } from '@/lib/api/types';

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
  const [open, setOpen] = React.useState(false);
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = React.useState(Math.min(10, capacity));
  const [submitting, setSubmitting] = React.useState(false);

  function handleOpen() {
    if (!isLoggedIn) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'pendingBookingIntent',
          JSON.stringify({
            vehicleId,
            model,
            companyName,
            capacity,
            finalPrice,
            ts: Date.now(),
          }),
        );
      }
      router.push(`/login?next=/veiculo/${vehicleId}`);
      return;
    }
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!origin.trim() || !destination.trim() || !date) {
      toast.error('Preencha origem, destino e data');
      return;
    }
    if (passengers < 1 || passengers > capacity) {
      toast.error(`Este veículo comporta entre 1 e ${capacity} passageiros`);
      return;
    }
    setSubmitting(true);
    try {
      const departureIso = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        8,
        0,
        0,
      ).toISOString();

      const quote = await api<QuoteSearchResponse>('/v1/quotes', {
        method: 'POST',
        body: {
          origin: origin.trim(),
          destination: destination.trim(),
          departureDate: departureIso,
          passengers,
        },
      });

      const item = quote.data.find((q) => q.vehicleId === vehicleId);
      if (!item) {
        toast.error('Veículo indisponível pra essa rota', {
          description:
            'Pode ser que a capacidade não atenda, ou a empresa não cubra essa região nessa data.',
        });
        return;
      }

      const booking = await api<{ id: string }>('/v1/bookings', {
        method: 'POST',
        body: {
          lockedQuoteId: item.lockedQuoteId,
          passengers,
          isRoundTrip: false,
        },
      });

      toast.success('Reserva criada', {
        description: 'Te levando pra confirmação…',
      });
      router.push(`/reserva/${booking.id}`);
    } catch (err) {
      const detail =
        err instanceof ApiError
          ? err.detail
          : err instanceof Error
            ? err.message
            : 'Erro inesperado';
      toast.error('Não foi possível criar a reserva', { description: detail });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
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

        <Button variant="accent" size="lg" fullWidth onClick={handleOpen}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Solicitar reserva</DialogTitle>
            <DialogDescription>
              {model} · {companyName}. Preencha os dados da viagem pra travarmos a cotação.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-bv-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-bv-3">
              <div className="flex flex-col gap-bv-1">
                <Label htmlFor="rsv-origin">Origem</Label>
                <Input
                  id="rsv-origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="São Paulo, SP"
                  required
                  disabled={submitting}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-bv-1">
                <Label htmlFor="rsv-destination">Destino</Label>
                <Input
                  id="rsv-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Campos do Jordão, SP"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-bv-3 items-end">
              <div className="flex flex-col gap-bv-1">
                <Label htmlFor="rsv-date">Data da viagem</Label>
                <DatePicker
                  id="rsv-date"
                  value={date}
                  onChange={setDate}
                  placeholder="Quando?"
                  fromDate={new Date()}
                  disabled={submitting}
                />
              </div>
              <Stepper
                value={passengers}
                onChange={setPassengers}
                min={1}
                max={capacity}
                label="Passageiros"
                unitLabel={`máx. ${capacity}`}
                disabled={submitting}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="accent" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enviando…
                  </>
                ) : (
                  'Confirmar e seguir'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
