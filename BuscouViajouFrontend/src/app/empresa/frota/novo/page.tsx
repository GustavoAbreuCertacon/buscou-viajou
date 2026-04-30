import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { serverApi } from '@/lib/api/server';
import { NewVehicleForm } from './form';

export const dynamic = 'force-dynamic';

const COMPANY_ROLES = ['COMPANY_ADMIN', 'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'];

interface Garage {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

interface Amenity {
  id: string;
  name: string;
  icon: string | null;
}

export default async function NovoVeiculoPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/empresa/login');
  if (!COMPANY_ROLES.includes(user.role)) redirect('/empresa/login?reason=role');

  let garages: Garage[] = [];
  let amenities: Amenity[] = [];
  try {
    const [g, a] = await Promise.all([
      serverApi<{ data: Garage[] }>('/v1/company/me/garages'),
      serverApi<{ data: Amenity[] }>('/v1/company/amenities', { auth: false }),
    ]);
    garages = g.data ?? [];
    amenities = a.data ?? [];
  } catch {
    // Mostra a página mesmo sem dados; o form permite cadastrar garagem
  }

  return (
    <>
      <Navbar
        user={{ firstName: user.firstName }}
        links={[
          { label: 'Painel', href: '/empresa' },
          { label: 'Frota', href: '/empresa' },
        ]}
      />
      <main id="main" className="bg-bv-bg min-h-[60vh]">
        <div className="container mx-auto max-w-3xl px-bv-5 py-bv-6 space-y-bv-5">
          <Link
            href="/empresa"
            className="inline-flex items-center gap-1 text-body-sm font-medium text-bv-navy/72 hover:text-bv-navy"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Voltar pro painel
          </Link>

          <header>
            <BicolorHeading as="h1" size="h1" navy="Cadastrar" green="veículo" />
            <p className="mt-bv-2 text-body text-bv-navy/72">
              Após cadastrar, o veículo já entra disponível pras buscas dos clientes.
            </p>
          </header>

          <NewVehicleForm garages={garages} amenities={amenities} />
        </div>
      </main>
      <Footer />
    </>
  );
}
