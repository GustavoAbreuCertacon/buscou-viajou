import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { MyBookings } from './my-bookings';
import { getCurrentUser } from '@/lib/auth/get-current-user';

export const dynamic = 'force-dynamic';

export default async function MyTripsPage() {
  const user = await getCurrentUser();
  const userMeta = user ? { firstName: user.firstName } : null;

  return (
    <>
      <Navbar user={userMeta} />
      <main id="main" className="bg-bv-bg min-h-[60vh]">
        <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-7">
          <header className="mb-bv-6">
            <BicolorHeading as="h1" size="h1" navy="Minhas" green="solicitações" />
            <p className="mt-bv-2 text-body text-bv-navy/72 max-w-2xl">
              Acompanhe os pedidos que você enviou pras empresas. A finalização
              da reserva e o pagamento acontecem direto com cada parceiro.
            </p>
          </header>

          <MyBookings />
        </div>
      </main>
      <Footer />
    </>
  );
}
