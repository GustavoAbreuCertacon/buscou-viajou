import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Bus, Star, MessageSquare, MapPin, Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { Button } from '@/components/ui/button';
import { CompanyHeader, StatCard, FleetVehicleCard } from '@/components/feature';
import { serverApi } from '@/lib/api/server';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { ApiError } from '@/lib/api/client';

export const dynamic = 'force-dynamic';

const COMPANY_ROLES = ['COMPANY_ADMIN', 'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'];

interface CompanyDetail {
  id: string;
  name: string;
  legal_name: string | null;
  logo_url: string | null;
  description: string | null;
  operating_regions: string[] | null;
  average_rating: number;
  total_reviews: number;
  status: string;
  addresses: Array<{
    street: string | null;
    number: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    neighborhood: string | null;
  }> | null;
}

interface FleetVehicle {
  id: string;
  model: string;
  vehicle_type: 'BUS' | 'MINIBUS' | 'VAN';
  capacity: number;
  average_rating: number;
  total_reviews: number;
  photos: Array<{ file_url: string; display_order: number }>;
}

const ROLE_LABEL: Record<string, string> = {
  COMPANY_ADMIN: 'Administrador',
  COMPANY_OPERATOR: 'Operador',
  COMPANY_FINANCIAL: 'Financeiro',
};

export default async function EmpresaPainelPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/empresa/login');
  }
  if (!COMPANY_ROLES.includes(user.role)) {
    redirect('/empresa/login?reason=role');
  }
  if (!user.companyId) {
    redirect('/empresa/login?reason=no-company');
  }

  let company: CompanyDetail;
  let vehicles: { data: FleetVehicle[] } = { data: [] };

  try {
    [company, vehicles] = await Promise.all([
      serverApi<CompanyDetail>(`/v1/companies/${user.companyId}`, { auth: false }),
      serverApi<{ data: FleetVehicle[] }>(`/v1/companies/${user.companyId}/vehicles`, { auth: false }),
    ]);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      redirect('/empresa/login?reason=no-company');
    }
    throw e;
  }

  const fleet = vehicles.data ?? [];
  const totalCapacity = fleet.reduce((sum, v) => sum + (v.capacity ?? 0), 0);
  const fleetAvgRating =
    fleet.length > 0
      ? fleet.reduce((sum, v) => sum + Number(v.average_rating ?? 0), 0) / fleet.length
      : 0;
  const fleetTotalReviews = fleet.reduce((sum, v) => sum + (v.total_reviews ?? 0), 0);
  const primaryAddress = company.addresses?.[0];
  const headquarters = primaryAddress
    ? `${primaryAddress.city ?? ''}${primaryAddress.state ? ', ' + primaryAddress.state : ''}`
    : null;

  return (
    <>
      <Navbar
        user={{ firstName: user.firstName }}
        links={[
          { label: 'Painel', href: '/empresa' },
          { label: 'Como funciona', href: '/#como-funciona' },
        ]}
      />

      <main id="main" className="bg-bv-bg min-h-[60vh]">
        <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-6 space-y-bv-6">
          <div>
            <p className="text-body-sm text-bv-navy/72">
              Olá, <strong className="text-bv-navy">{user.firstName}</strong> ·{' '}
              {ROLE_LABEL[user.role] ?? 'Acesso de empresa'}
            </p>
            <BicolorHeading as="h1" size="h1" navy="Painel da" green="empresa" />
            <p className="mt-bv-2 text-body text-bv-navy/72">
              Acompanhe sua frota e o desempenho da sua operação na Buscou Viajou.
            </p>
          </div>

          <CompanyHeader
            name={company.name}
            legalName={company.legal_name}
            logoUrl={company.logo_url}
            description={company.description}
            status={company.status}
            averageRating={Number(company.average_rating ?? 0)}
            totalReviews={company.total_reviews ?? 0}
            operatingRegions={company.operating_regions}
            city={primaryAddress?.city}
            state={primaryAddress?.state}
          />

          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">
              Indicadores principais
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-bv-4">
              <StatCard
                icon={Bus}
                label="Veículos na frota"
                value={fleet.length}
                hint={`${totalCapacity} lugares no total`}
                tone="green"
              />
              <StatCard
                icon={Star}
                label="Avaliação média"
                value={fleetAvgRating.toFixed(1).replace('.', ',')}
                hint="média ponderada da frota"
                tone="green"
              />
              <StatCard
                icon={MessageSquare}
                label="Avaliações recebidas"
                value={fleetTotalReviews}
                hint="todos os veículos"
                tone="navy"
              />
              <StatCard
                icon={MapPin}
                label="Regiões atendidas"
                value={(company.operating_regions ?? []).length || (headquarters ? 1 : 0)}
                hint={headquarters ?? 'Cadastre estados'}
                tone="navy"
              />
            </div>
          </section>

          <section aria-labelledby="fleet-heading" className="space-y-bv-4">
            <header className="flex items-end justify-between gap-bv-3 flex-wrap">
              <div>
                <h2
                  id="fleet-heading"
                  className="font-heading font-bold text-h3 text-bv-navy leading-snug"
                >
                  Sua frota
                </h2>
                <p className="text-body-sm text-bv-navy/72">
                  {fleet.length === 0
                    ? 'Nenhum veículo cadastrado.'
                    : `${fleet.length} ${fleet.length === 1 ? 'veículo ativo' : 'veículos ativos'}.`}
                </p>
              </div>
              <Button asChild variant="accent" size="md" iconLeft={<Plus size={16} />}>
                <Link href="/empresa/frota/novo">Cadastrar veículo</Link>
              </Button>
            </header>

            {fleet.length === 0 ? (
              <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center">
                <Bus
                  size={32}
                  strokeWidth={1.5}
                  className="text-bv-navy/24 mx-auto mb-bv-3"
                  aria-hidden
                />
                <p className="text-body font-semibold text-bv-navy">
                  Sua frota ainda está vazia
                </p>
                <p className="mt-bv-1 text-body-sm text-bv-navy/72 mb-bv-4">
                  Cadastre seu primeiro veículo pra começar a aparecer nas buscas.
                </p>
                <Button asChild variant="accent" size="md" iconLeft={<Plus size={16} />}>
                  <Link href="/empresa/frota/novo">Cadastrar veículo</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-bv-4">
                {fleet.map((v) => (
                  <FleetVehicleCard
                    key={v.id}
                    id={v.id}
                    model={v.model}
                    vehicleType={v.vehicle_type}
                    capacity={v.capacity}
                    averageRating={Number(v.average_rating ?? 0)}
                    totalReviews={v.total_reviews ?? 0}
                    photos={(v.photos ?? [])
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((p) => p.file_url)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
