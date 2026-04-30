'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Luggage, Search } from 'lucide-react';
import { api } from '@/lib/api/client';
import { BookingCard, type BookingCardData } from '@/components/feature/booking-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { cn } from '@/lib/utils/cn';
import type { BookingStatus } from '@/lib/api/types';

interface ApiBooking {
  id: string;
  booking_code: string | null;
  status: BookingStatus;
  passengers: number;
  total_price: number;
  departure_date: string;
  origin_address: string;
  destination_address: string;
  vehicle?: {
    id: string;
    model: string;
    vehicle_type: string;
    photos?: Array<{ file_url: string; display_order: number }>;
  };
  company?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

const TABS: Array<{ key: 'upcoming' | 'inProgress' | 'completed' | 'cancelled'; label: string; statuses: BookingStatus[] }> = [
  { key: 'upcoming',   label: 'Próximas',     statuses: ['PENDING_APPROVAL', 'PENDING_PAYMENT', 'CONFIRMED'] },
  { key: 'inProgress', label: 'Em andamento', statuses: ['IN_PROGRESS', 'PENDING_COMPLETION'] },
  { key: 'completed',  label: 'Concluídas',   statuses: ['COMPLETED'] },
  { key: 'cancelled',  label: 'Outras',       statuses: ['CANCELLED_BY_CLIENT', 'CANCELLED_BY_COMPANY', 'REJECTED', 'EXPIRED', 'NO_SHOW_CLIENT', 'NO_SHOW_COMPANY'] },
];

export function MyBookings() {
  const [activeTab, setActiveTab] = React.useState<typeof TABS[number]['key']>('upcoming');

  const { data, isLoading, error } = useQuery<{ data: ApiBooking[] }>({
    queryKey: ['my-bookings'],
    queryFn: () => api<{ data: ApiBooking[] }>('/v1/bookings'),
    staleTime: 30_000,
  });

  if (isLoading) return <BookingsSkeleton />;

  if (error) {
    return (
      <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center">
        <p className="text-body text-bv-danger">Não conseguimos carregar suas viagens. Tente em instantes.</p>
      </div>
    );
  }

  const allBookings = data?.data ?? [];

  if (allBookings.length === 0) {
    return <EmptyState />;
  }

  const counts: Record<string, number> = {};
  TABS.forEach((t) => {
    counts[t.key] = allBookings.filter((b) => t.statuses.includes(b.status)).length;
  });

  const activeStatuses = TABS.find((t) => t.key === activeTab)!.statuses;
  const visible = allBookings.filter((b) => activeStatuses.includes(b.status));

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-bv-1 overflow-x-auto pb-bv-2 -mx-bv-2 px-bv-2 mb-bv-5 border-b border-bv-navy/8">
        {TABS.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={cn(
                'inline-flex items-center gap-bv-2 px-bv-4 py-bv-3 -mb-px border-b-bv-base whitespace-nowrap',
                'text-body font-semibold transition-colors duration-bv-fast',
                'focus-visible:outline-none focus-visible:rounded-bv-sm focus-visible:shadow-bv-focus',
                isActive
                  ? 'border-bv-green text-bv-navy'
                  : 'border-transparent text-bv-navy/72 hover:text-bv-navy',
              )}
            >
              {t.label}
              {counts[t.key] > 0 && (
                <span
                  className={cn(
                    'inline-flex h-5 min-w-[20px] items-center justify-center rounded-bv-pill px-1.5 text-caption font-bold tabular-nums',
                    isActive ? 'bg-bv-green text-white' : 'bg-bv-navy-50 text-bv-navy/72',
                  )}
                >
                  {counts[t.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center">
          <p className="text-body text-bv-navy/72">Nada por aqui ainda.</p>
        </div>
      ) : (
        <div className="space-y-bv-4">
          {visible.map((b) => (
            <BookingCard key={b.id} booking={mapToCardData(b)} />
          ))}
        </div>
      )}
    </div>
  );
}

function mapToCardData(b: ApiBooking): BookingCardData {
  const photoUrl =
    b.vehicle?.photos?.sort((a, c) => a.display_order - c.display_order)[0]?.file_url ?? null;
  return {
    id: b.id,
    bookingCode: b.booking_code,
    status: b.status,
    passengers: b.passengers,
    totalPrice: Number(b.total_price),
    departureDate: b.departure_date,
    originAddress: b.origin_address,
    destinationAddress: b.destination_address,
    vehicle: b.vehicle
      ? { model: b.vehicle.model, photoUrl }
      : undefined,
    company: b.company
      ? { name: b.company.name, logoUrl: b.company.logo_url }
      : undefined,
  };
}

function BookingsSkeleton() {
  return (
    <div className="space-y-bv-4">
      <Skeleton shape="text" className="w-1/3 h-8" />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-[180px]" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-9 text-center max-w-2xl mx-auto">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-bv-md bg-bv-green-50 text-bv-green-700 mx-auto mb-bv-4">
        <Luggage className="h-8 w-8" strokeWidth={2} />
      </div>
      <BicolorHeading as="h2" size="h2" navy="Sua próxima" green="viagem começa aqui." />
      <p className="mt-bv-3 text-body text-bv-navy/72 max-w-md mx-auto">
        Você ainda não viajou com a gente. Que tal a primeira?
      </p>
      <Button asChild variant="accent" size="lg" iconLeft={<Search className="h-4 w-4" />} className="mt-bv-5">
        <Link href="/">Buscar veículos</Link>
      </Button>
    </div>
  );
}
