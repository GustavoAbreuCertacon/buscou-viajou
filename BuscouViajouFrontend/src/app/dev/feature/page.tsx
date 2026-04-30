'use client';

import * as React from 'react';
import { Wifi, AirVent, Tv, Usb, Toilet, Armchair } from 'lucide-react';
import {
  PricingBadge,
  AmenityGrid,
  ReviewCard,
  BookingStatusBadge,
  SearchForm,
  VehicleResultCard,
  FiltersSidebar,
  applyFilters,
  defaultFilters,
  SortBar,
  sortResults,
  BookingCard,
  VehicleGallery,
  PriceBreakdown,
  RouteMap,
  TicketViewer,
  type FiltersState,
  type SortKey,
} from '@/components/feature';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import type { QuoteResultItem, BookingStatus } from '@/lib/api/types';

/* ==========================================================================
   Mock data — realista, espelha o que o backend de fato retorna
   ========================================================================== */

const MOCK_AMENITIES = [
  { id: '1', name: 'Wi-Fi', icon: 'wifi' },
  { id: '2', name: 'Ar-condicionado', icon: 'air-vent' },
  { id: '3', name: 'Banheiro', icon: 'toilet' },
  { id: '4', name: 'TV', icon: 'tv' },
  { id: '5', name: 'Tomada USB', icon: 'usb' },
  { id: '6', name: 'Poltrona-leito', icon: 'armchair' },
];

const MOCK_RESULTS: QuoteResultItem[] = [
  {
    vehicleId: 'v1',
    lockedQuoteId: 'lq1',
    model: 'Marcopolo Paradiso G8 1800 DD',
    vehicleType: 'BUS',
    capacity: 46,
    averageRating: 4.7,
    totalReviews: 152,
    photos: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80&auto=format',
    ],
    amenities: MOCK_AMENITIES.slice(0, 6),
    company: {
      id: 'c1',
      name: 'TransTur SP',
      logoUrl: 'https://placehold.co/80x40/0B2A43/FFFFFF/png?text=TransTur',
      averageRating: 4.6,
      totalReviews: 348,
    },
    pricing: {
      basePrice: 3200,
      multiplier: 1.0,
      finalPrice: 3200,
      indicator: 'NORMAL',
      indicatorLabel: 'Preço normal',
      lockedUntil: new Date(Date.now() + 28 * 60_000).toISOString(),
    },
    route: { distanceKm: 450, estimatedDurationHours: 6 },
  },
  {
    vehicleId: 'v2',
    lockedQuoteId: 'lq2',
    model: 'Comil Campione DD',
    vehicleType: 'BUS',
    capacity: 44,
    averageRating: 4.4,
    totalReviews: 89,
    photos: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80&auto=format',
    ],
    amenities: MOCK_AMENITIES.slice(0, 4),
    company: {
      id: 'c2',
      name: 'Capital Tour',
      logoUrl: null,
      averageRating: 4.4,
      totalReviews: 89,
    },
    pricing: {
      basePrice: 2800,
      multiplier: 1.2,
      finalPrice: 3360,
      indicator: 'HIGH',
      indicatorLabel: 'Alta procura',
      lockedUntil: new Date(Date.now() + 28 * 60_000).toISOString(),
    },
    route: { distanceKm: 450, estimatedDurationHours: 6 },
  },
  {
    vehicleId: 'v3',
    lockedQuoteId: 'lq3',
    model: 'Volare W9 Limousine',
    vehicleType: 'MINIBUS',
    capacity: 26,
    averageRating: 4.8,
    totalReviews: 201,
    photos: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format',
    ],
    amenities: MOCK_AMENITIES.slice(0, 3),
    company: {
      id: 'c3',
      name: 'Litoral Express',
      logoUrl: null,
      averageRating: 4.7,
      totalReviews: 198,
    },
    pricing: {
      basePrice: 2400,
      multiplier: 0.85,
      finalPrice: 2040,
      indicator: 'PROMO',
      indicatorLabel: 'Melhor preço',
      lockedUntil: new Date(Date.now() + 28 * 60_000).toISOString(),
    },
    route: { distanceKm: 450, estimatedDurationHours: 6 },
  },
];

const MOCK_BOOKING = (status: BookingStatus, code: string, daysOffset: number) => ({
  id: `book-${code}`,
  bookingCode: code,
  status,
  passengers: 12,
  totalPrice: 3200,
  departureDate: new Date(Date.now() + daysOffset * 86400_000).toISOString(),
  originAddress: 'São Paulo, SP',
  destinationAddress: 'Rio de Janeiro, RJ',
  vehicle: {
    model: 'Marcopolo Paradiso G8',
    photoUrl:
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80&auto=format',
  },
  company: { name: 'TransTur SP', logoUrl: null },
});

export default function FeatureShowcase() {
  const [filters, setFilters] = React.useState<FiltersState>(() => defaultFilters(MOCK_RESULTS));
  const [sort, setSort] = React.useState<SortKey>('relevant');

  const visible = sortResults(applyFilters(MOCK_RESULTS, filters), sort);

  return (
    <div className="min-h-screen bg-bv-bg pb-bv-9">
      <Navbar user={{ firstName: 'Ana' }} />
      <main className="container mx-auto max-w-bv-container px-bv-5 py-bv-7 space-y-bv-9">
        <header className="space-y-bv-3">
          <BicolorHeading as="h1" size="display" navy="Componentes" green="de Feature" />
          <p className="text-body-lg text-bv-navy/72 max-w-2xl">
            Composições de produto. Cada bloco demonstra um componente em uso real
            com dados que espelham o backend.
          </p>
        </header>

        {/* SearchForm */}
        <Section title="Search Form" subtitle="Hero (Landing) e compact (header /busca)">
          <div className="space-y-bv-5">
            <SearchForm variant="hero" />
            <div>
              <p className="text-caption text-bv-navy/72 uppercase tracking-wide mb-bv-2">
                Variant compact
              </p>
              <SearchForm variant="compact" initialValues={{ origin: 'São Paulo', destination: 'Rio de Janeiro', passengers: 12 }} />
            </div>
          </div>
        </Section>

        {/* Pricing Badges */}
        <Section title="Pricing Badges" subtitle="Indicadores de pricing dinâmico (5 níveis)">
          <div className="flex flex-wrap gap-bv-3">
            <PricingBadge indicator="PROMO" multiplier={0.85} />
            <PricingBadge indicator="NORMAL" />
            <PricingBadge indicator="HIGH" multiplier={1.2} />
            <PricingBadge indicator="VERY_HIGH" multiplier={1.45} />
            <PricingBadge indicator="PEAK" multiplier={1.8} />
          </div>
        </Section>

        {/* Booking Status Badges */}
        <Section title="Booking Status Badges" subtitle="12 estados da reserva">
          <div className="flex flex-wrap gap-bv-3">
            <BookingStatusBadge status="PENDING_APPROVAL" />
            <BookingStatusBadge status="PENDING_PAYMENT" />
            <BookingStatusBadge status="CONFIRMED" />
            <BookingStatusBadge status="IN_PROGRESS" />
            <BookingStatusBadge status="PENDING_COMPLETION" />
            <BookingStatusBadge status="COMPLETED" />
            <BookingStatusBadge status="CANCELLED_BY_CLIENT" />
            <BookingStatusBadge status="CANCELLED_BY_COMPANY" />
            <BookingStatusBadge status="REJECTED" />
            <BookingStatusBadge status="EXPIRED" />
            <BookingStatusBadge status="NO_SHOW_CLIENT" />
            <BookingStatusBadge status="NO_SHOW_COMPANY" />
          </div>
        </Section>

        {/* Amenity Grid */}
        <Section title="Amenity Grid" subtitle="Inline (cards) e grid (detalhes)">
          <div className="space-y-bv-5">
            <div>
              <p className="text-caption text-bv-navy/72 uppercase tracking-wide mb-bv-2">
                Inline (5 + overflow)
              </p>
              <AmenityGrid amenities={MOCK_AMENITIES} variant="inline" inlineLimit={4} />
            </div>
            <div>
              <p className="text-caption text-bv-navy/72 uppercase tracking-wide mb-bv-3">
                Grid completo
              </p>
              <AmenityGrid amenities={MOCK_AMENITIES} variant="grid" />
            </div>
          </div>
        </Section>

        {/* Resultados de busca + filtros + sort */}
        <Section
          title="Resultados de Busca"
          subtitle="Lista + filtros sidebar + ordenação (PRD §6.10)"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-bv-5">
            <FiltersSidebar
              results={MOCK_RESULTS}
              value={filters}
              onChange={setFilters}
            />
            <div className="space-y-bv-4">
              <SortBar value={sort} onChange={setSort} totalCount={visible.length} />
              <div className="space-y-bv-4">
                {visible.map((r) => (
                  <VehicleResultCard key={r.vehicleId} result={r} />
                ))}
                {visible.length === 0 && (
                  <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center">
                    <p className="text-body text-bv-navy/72">
                      Nenhum veículo combina com seus filtros.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Booking Cards */}
        <Section title="Booking Cards" subtitle="Lista de reservas em /minhas-viagens">
          <div className="space-y-bv-4">
            <BookingCard booking={MOCK_BOOKING('CONFIRMED', 'BV-2026-A3K9', 5)} />
            <BookingCard booking={MOCK_BOOKING('PENDING_PAYMENT', 'BV-2026-B7M2', 8)} />
            <BookingCard booking={MOCK_BOOKING('COMPLETED', 'BV-2026-C2N5', -10)} />
            <BookingCard booking={MOCK_BOOKING('CANCELLED_BY_CLIENT', 'BV-2026-D9P1', -15)} />
          </div>
        </Section>

        {/* Vehicle Gallery */}
        <Section title="Vehicle Gallery" subtitle="Carousel + lightbox (PRD §6.11 Seção 1)">
          <VehicleGallery
            photos={[
              'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80&auto=format',
              'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80&auto=format',
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format',
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80&auto=format',
              'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&q=80&auto=format',
            ]}
          />
        </Section>

        {/* Price Breakdown */}
        <Section title="Price Breakdown" subtitle="Accordion com cálculo do preço (RN-PRICE-001/002)">
          <div className="max-w-md space-y-bv-3">
            <PriceBreakdown
              basePrice={2700}
              multiplier={1.0}
              finalPrice={2700}
              distanceKm={450}
              pricePerKm={6}
              minDepartureCost={500}
            />
            <PriceBreakdown
              basePrice={2700}
              multiplier={1.2}
              finalPrice={3240}
              distanceKm={450}
              pricePerKm={6}
              minDepartureCost={500}
              addons={[{ name: 'Guia turístico', quantity: 1, totalPrice: 300 }]}
            />
          </div>
        </Section>

        {/* Route Map */}
        <Section title="Route Map" subtitle="Leaflet + OpenStreetMap (sem API key)">
          <RouteMap
            origin={{ lat: -23.5505, lng: -46.6333, label: 'São Paulo, SP' }}
            destination={{ lat: -22.7392, lng: -45.5912, label: 'Campos do Jordão, SP' }}
            garage={{ lat: -23.5435, lng: -46.5752, label: 'Garagem TransTur — Tatuapé' }}
            height={400}
          />
        </Section>

        {/* Review Cards */}
        <Section title="Review Cards" subtitle="Avaliações públicas com resposta da empresa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-4">
            <ReviewCard
              rating={5}
              comment="Viagem tranquila, motorista pontual e veículo em ótimo estado. Recomendo!"
              createdAt={new Date(Date.now() - 5 * 86400_000).toISOString()}
              client={{ first_name: 'Ana', last_initial: 'S' }}
              vehicleModel="Marcopolo Paradiso G8 1800 DD"
              response={{
                response: 'Obrigada pelo feedback, Ana! Vamos continuar caprichando.',
                created_at: new Date(Date.now() - 4 * 86400_000).toISOString(),
              }}
            />
            <ReviewCard
              rating={4}
              comment="Boa empresa, mas chegou 15 minutos atrasada na origem."
              createdAt={new Date(Date.now() - 12 * 86400_000).toISOString()}
              client={{ first_name: 'Bruno', last_initial: 'P' }}
            />
          </div>
        </Section>

        {/* Ticket Viewer */}
        <Section title="Ticket Viewer" subtitle="Bilhete digital com QR Code (PRD §6.8)">
          <TicketViewer
            ticketCode="BV-2026-A3K9"
            qrPngBase64={`data:image/png;base64,${MOCK_QR_PNG}`}
            status="VALID"
            booking={{
              status: 'CONFIRMED',
              passengers: 12,
              departureDate: new Date(Date.now() + 5 * 86400_000).toISOString(),
              origin: 'São Paulo, SP',
              destination: 'Campos do Jordão, SP',
              totalPrice: 3200,
            }}
            vehicle={{ model: 'Marcopolo Paradiso G8', vehicleType: 'BUS' }}
            company={{ name: 'TransTur SP' }}
            driver={{
              firstName: 'Carlos',
              lastName: 'Almeida',
              phone: '+5511990001111',
            }}
            client={{ firstName: 'Ana', lastName: 'Souza' }}
          />
        </Section>
      </main>
      <Footer />
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-bv-5">
      <div>
        <h2 className="font-heading font-bold text-h2 text-bv-navy">{title}</h2>
        {subtitle && <p className="text-body text-bv-navy/72 mt-bv-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

/** QR Code minimalista PNG inline pra demo (não precisa do backend pra testar) */
const MOCK_QR_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEUAAAD///+l2Z/dAAAAUUlEQVR4nO3WMQ4AIAgEwSP+/8/FBpMVCxH6oc1cl3oA6hCAdQjY7oF0CIJlCBpzGwR9IBxCBxBdgvgJEifUSi5Lksp8H8SKIqLNn0LWv+EBMFcKWB9WeZcAAAAASUVORK5CYII=';
