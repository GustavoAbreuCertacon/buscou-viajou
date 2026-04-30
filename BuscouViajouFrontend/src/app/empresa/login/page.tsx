import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { CompanyLoginForm } from './login-form';
import { getCurrentUser } from '@/lib/auth/get-current-user';

export const dynamic = 'force-dynamic';

const COMPANY_ROLES = ['COMPANY_ADMIN', 'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'];

export default async function CompanyLoginPage() {
  const user = await getCurrentUser();
  if (user && COMPANY_ROLES.includes(user.role)) {
    redirect('/empresa');
  }

  return (
    <>
      <Navbar />
      <main
        id="main"
        className="bv-canvas min-h-[calc(100vh-4rem)] flex items-start md:items-center justify-center py-bv-7 px-bv-4"
      >
        <div className="w-full max-w-md">
          <div className="rounded-bv-lg bg-white shadow-bv-lg p-bv-6 md:p-bv-7">
            <header className="mb-bv-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-bv-navy text-white mb-bv-3">
                <Building2 className="h-6 w-6" strokeWidth={2} />
              </div>
              <BicolorHeading as="h1" size="h2" navy="Painel da" green="empresa" />
              <p className="mt-bv-2 text-body text-bv-navy/72">
                Acesso exclusivo pra empresas parceiras. Use o e-mail e senha do administrador.
              </p>
            </header>

            <CompanyLoginForm />

            <div className="mt-bv-5 pt-bv-5 border-t border-bv-navy/8 space-y-bv-2">
              <p className="text-body-sm text-bv-navy/72">
                Ainda não é parceiro?{' '}
                <Link
                  href="/seja-parceiro"
                  className="font-semibold text-bv-green hover:text-bv-green-700"
                >
                  Cadastre sua empresa
                </Link>
              </p>
              <p className="text-body-sm text-bv-navy/72">
                Você é cliente?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-bv-green hover:text-bv-green-700"
                >
                  Entrar com link mágico
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
