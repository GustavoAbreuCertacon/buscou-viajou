import { notFound } from 'next/navigation';
import { ArrowLeft, Bus, Users, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import {
  VehicleGallery,
  PriceBreakdown,
  AmenityGrid,
  ReviewCard,
  RouteMap,
} from '@/components/feature';
import { ReserveCta } from './reserve-cta';
import { serverApi } from '@/lib/api/server';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { ApiError } from '@/lib/api/client';
import { pluralCapacity, pluralReviews, VEHICLE_TYPE_LABEL } from '@/lib/utils/format';

export const revalidate = 300;

interface VehicleDetail {
  id: string;
  model: string;
  vehicle_type: 'BUS' | 'MINIBUS' | 'VAN';
  capacity: number;
  price_per_km: number;
  min_departure_cost: number;
  average_rating: number;
  total_reviews: number;
  dynamic_pricing_enabled: boolean;
  company: {
    id: string;
    name: string;
    logo_url: string | null;
    average_rating: number;
    total_reviews: number;
    description: string | null;
  };
  garage?: {
    id: string;
    name: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  photos: string[];
  amenities: Array<{ id: string; name: string; icon: string | null }>;
}

interface Review {
  id: string;
  overall_rating: number;
  comment: string | null;
  created_at: string;
  client: { first_name: string; last_initial: string } | null;
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let vehicle: VehicleDetail;
  let reviews: { data: Review[] } = { data: [] };

  try {
    [vehicle, reviews] = await Promise.all([
      serverApi<VehicleDetail>(`/v1/vehicles/${id}`, { auth: false, revalidate: 300 }),
      serverApi<{ data: Review[] }>(`/v1/vehicles/${id}/reviews`, { auth: false, revalidate: 300 }),
    ]);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const user = await getCurrentUser();
  const userMeta = user ? { firstName: user.firstName } : null;

  // Mock pricing pra exibir o breakdown (em produção viria do lockedQuote)
  const distanceKm = 450; // exemplo — virá da rota real quando vier de cotação
  const computedKm = distanceKm * Number(vehicle.price_per_km);
  const basePrice = Math.max(Number(vehicle.min_departure_cost), computedKm);
  const finalPrice = basePrice;

  return (
    <>
      <Navbar user={userMeta} />

      <main id="main" className="bg-bv-bg min-h-[60vh]">
        <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-6">
          <Link
            href="/busca"
            className="inline-flex items-center gap-1 text-body-sm font-medium text-bv-navy/72 hover:text-bv-navy mb-bv-4"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Voltar pra busca
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-bv-6">
            {/* Coluna principal */}
            <div className="space-y-bv-6 min-w-0">
              {/* Header */}
              <header className="space-y-bv-3">
                <div className="flex flex-wrap items-center gap-bv-2">
                  <Badge variant="neutral" size="md">
                    {VEHICLE_TYPE_LABEL[vehicle.vehicle_type]}
                  </Badge>
                  <Badge variant="outlineNavy" size="md">
                    <Users size={12} strokeWidth={2.5} className="mr-1" />
                    {pluralCapacity(vehicle.capacity)}
                  </Badge>
                </div>
                <BicolorHeading as="h1" size="h1">
                  {vehicle.model}
                </BicolorHeading>
                <div className="flex items-center gap-bv-3 text-body-sm text-bv-navy/72 flex-wrap">
                  <Link
                    href={`/empresa/${vehicle.company.id}`}
                    className="font-semibold text-bv-navy hover:text-bv-green"
                  >
                    {vehicle.company.name}
                  </Link>
                  <span aria-hidden>·</span>
                  <StarRating
                    value={Number(vehicle.average_rating)}
                    showValue
                    count={vehicle.total_reviews}
                    size="sm"
                  />
                </div>
              </header>

              <VehicleGallery photos={vehicle.photos} alt={vehicle.model} />

              {/* Sobre */}
              {vehicle.company.description && (
                <section className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-5">
                  <h2 className="font-heading font-bold text-h4 text-bv-navy mb-bv-2">
                    Sobre a empresa
                  </h2>
                  <p className="text-body text-bv-navy/80 leading-relaxed">
                    {vehicle.company.description}
                  </p>
                </section>
              )}

              {/* Comodidades */}
              <section className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-5">
                <h2 className="font-heading font-bold text-h4 text-bv-navy mb-bv-4">
                  Comodidades
                </h2>
                <AmenityGrid amenities={vehicle.amenities} variant="grid" />
              </section>

              {/* Mapa */}
              {vehicle.garage && (
                <section className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-5">
                  <h2 className="font-heading font-bold text-h4 text-bv-navy mb-bv-2">
                    Localização
                  </h2>
                  <p className="text-body-sm text-bv-navy/72 mb-bv-4 inline-flex items-center gap-1">
                    <MapPin size={14} strokeWidth={2} className="text-bv-navy/48" />
                    Saída de {vehicle.garage.name} · {vehicle.garage.city}, {vehicle.garage.state}
                  </p>
                  <RouteMap
                    origin={{
                      lat: Number(vehicle.garage.latitude),
                      lng: Number(vehicle.garage.longitude),
                      label: vehicle.garage.name,
                    }}
                    destination={{
                      lat: Number(vehicle.garage.latitude),
                      lng: Number(vehicle.garage.longitude),
                      label: vehicle.garage.city,
                    }}
                    height={320}
                  />
                </section>
              )}

              {/* Avaliações */}
              <section>
                <h2 className="font-heading font-bold text-h3 text-bv-navy mb-bv-4">
                  Avaliações <span className="text-bv-navy/72 font-normal">({pluralReviews(vehicle.total_reviews)})</span>
                </h2>
                {reviews.data.length === 0 ? (
                  <p className="text-body text-bv-navy/72 italic">
                    Este veículo ainda não tem avaliações.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-4">
                    {reviews.data.slice(0, 4).map((r) => (
                      <ReviewCard
                        key={r.id}
                        rating={r.overall_rating}
                        comment={r.comment ?? undefined}
                        createdAt={r.created_at}
                        client={
                          r.client
                            ? { first_name: r.client.first_name, last_initial: r.client.last_initial }
                            : null
                        }
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar de preço */}
            <aside className="lg:sticky lg:top-24 lg:self-start space-y-bv-4">
              <ReserveCta
                vehicleId={vehicle.id}
                model={vehicle.model}
                companyName={vehicle.company.name}
                capacity={vehicle.capacity}
                finalPrice={finalPrice}
                basePrice={basePrice}
                multiplier={1.0}
                pricePerKm={Number(vehicle.price_per_km)}
                minDepartureCost={Number(vehicle.min_departure_cost)}
                distanceKm={distanceKm}
                isLoggedIn={!!userMeta}
              />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
