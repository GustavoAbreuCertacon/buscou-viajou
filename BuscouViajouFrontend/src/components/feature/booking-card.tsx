'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Bus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingStatusBadge } from './booking-status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import type { BookingStatus } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

export interface BookingCardData {
  id: string;
  bookingCode?: string | null;
  status: BookingStatus;
  passengers: number;
  totalPrice: number;
  departureDate: string;
  originAddress: string;
  destinationAddress: string;
  vehicle?: {
    model: string;
    photoUrl?: string | null;
  };
  company?: {
    name: string;
    logoUrl?: string | null;
  };
}

interface Props {
  booking: BookingCardData;
  className?: string;
}

/**
 * BookingCard — usado em /minhas-viagens (PRD §6.12).
 * Mostra rota, data, status e ações contextuais por status.
 */
export function BookingCard({ booking, className }: Props) {
  const detailHref = `/reserva/${booking.id}`;
  const photo = booking.vehicle?.photoUrl;

  const actions = renderActions(booking);

  return (
    <Card variant="default" padding="none" className={cn('overflow-hidden', className)}>
      <div className="flex flex-col md:flex-row">
        {/* Foto do veículo (mobile: topo, desktop: esquerda) */}
        <div className="relative w-full md:w-[200px] aspect-[16/9] md:aspect-auto md:min-h-[180px] shrink-0 bg-bv-navy-50">
          {photo ? (
            <Image
              src={photo}
              alt={booking.vehicle?.model ?? 'Veículo'}
              fill
              sizes="(max-width: 768px) 100vw, 200px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-bv-navy/24">
              <Bus className="h-10 w-10" />
            </div>
          )}
          <div className="absolute top-bv-2 left-bv-2">
            <BookingStatusBadge status={booking.status} size="sm" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 p-bv-5 flex flex-col gap-bv-3">
          <header className="flex items-start justify-between gap-bv-3">
            <div className="min-w-0 flex-1">
              <p className="text-caption text-bv-navy/72 tabular-nums uppercase tracking-wide">
                {booking.bookingCode ?? booking.id.slice(0, 8)}
              </p>
              <h3 className="font-heading font-bold text-h4 text-bv-navy leading-snug mt-bv-1 flex items-center gap-bv-2">
                <span className="truncate">{cleanAddress(booking.originAddress)}</span>
                <ArrowRight size={18} className="shrink-0 text-bv-navy/48" strokeWidth={2.5} />
                <span className="truncate">{cleanAddress(booking.destinationAddress)}</span>
              </h3>
              <p className="mt-bv-1 text-body-sm text-bv-navy/72">
                {formatDateTime(booking.departureDate)} ·{' '}
                {booking.passengers === 1 ? '1 passageiro' : `${booking.passengers} passageiros`}
              </p>
            </div>
          </header>

          <div className="flex items-center gap-bv-2 text-body-sm text-bv-navy/72">
            {booking.company?.name && (
              <>
                <MapPin size={14} strokeWidth={2} className="text-bv-navy/48" />
                <span>{booking.company.name}</span>
                {booking.vehicle?.model && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{booking.vehicle.model}</span>
                  </>
                )}
              </>
            )}
          </div>

          <footer className="mt-auto flex items-center justify-between gap-bv-3 pt-bv-2">
            <div>
              <p className="font-heading font-bold text-h4 text-bv-navy tabular-nums leading-none">
                {formatCurrency(booking.totalPrice)}
              </p>
              <p className="text-caption text-bv-navy/72 mt-bv-1">total da viagem</p>
            </div>
            <div className="flex items-center gap-bv-2">{actions}</div>
          </footer>
        </div>
      </div>

      <Link
        href={detailHref}
        className="absolute inset-0 z-0"
        aria-label={`Ver detalhes da reserva ${booking.bookingCode ?? booking.id.slice(0, 8)}`}
      >
        <span className="sr-only">Ver detalhes</span>
      </Link>
    </Card>
  );
}

function renderActions(booking: BookingCardData) {
  switch (booking.status) {
    case 'PENDING_PAYMENT':
      return (
        <Button asChild variant="accent" size="sm" className="relative z-10">
          <Link href={`/reserva/${booking.id}`}>Pagar agora</Link>
        </Button>
      );
    case 'CONFIRMED':
    case 'IN_PROGRESS':
      return (
        <Button asChild variant="primary" size="sm" className="relative z-10">
          <Link href={`/reserva/${booking.id}`}>Ver bilhete</Link>
        </Button>
      );
    case 'COMPLETED':
      return (
        <Button asChild variant="outline" size="sm" className="relative z-10">
          <Link href={`/reserva/${booking.id}`}>Avaliar</Link>
        </Button>
      );
    default:
      return (
        <Button asChild variant="ghost" size="sm" className="relative z-10">
          <Link href={`/reserva/${booking.id}`}>Ver detalhes</Link>
        </Button>
      );
  }
}

/** Remove sufixos longos tipo ", São Paulo, SP, Brasil" pra caber no card */
function cleanAddress(addr: string): string {
  const parts = addr.split(',').map((s) => s.trim());
  // Pega só os 2 primeiros pedaços, ex: "São Paulo, SP"
  return parts.slice(0, 2).join(', ');
}
