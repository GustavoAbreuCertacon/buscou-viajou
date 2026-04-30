import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LoginForm } from './login-form';
import { BicolorHeading } from '@/components/ui/bicolor-heading';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? '/minhas-viagens';

  return (
    <>
      <Navbar />
      <main id="main" className="bv-canvas flex items-start md:items-center justify-center py-bv-9 px-bv-4">
        <div className="w-full max-w-md">
          <div className="rounded-bv-lg bg-white shadow-bv-lg p-bv-6 md:p-bv-7">
            <header className="mb-bv-5">
              <BicolorHeading as="h1" size="h2" navy="Buscou" green="sem senha." />
              <p className="mt-bv-2 text-body text-bv-navy/72">
                Enviamos um link mágico pra seu e-mail. É só clicar e pronto.
              </p>
            </header>

            <LoginForm next={next} />

            <p className="mt-bv-5 text-caption text-bv-navy/72 text-center">
              Sem cadastro, sem senha, sem complicação.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
