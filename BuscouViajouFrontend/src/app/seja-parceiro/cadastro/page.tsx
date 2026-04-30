import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { PartnerSignupWizard } from './wizard';

export const metadata = {
  title: 'Cadastro de empresa parceira — Buscou Viajou',
};

export const dynamic = 'force-dynamic';

export default function CadastroEmpresaPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-bv-bg min-h-[calc(100vh-4rem)] py-bv-7 px-bv-4">
        <div className="container mx-auto max-w-3xl">
          <header className="mb-bv-6">
            <BicolorHeading as="h1" size="h1" navy="Cadastre sua" green="empresa" />
            <p className="mt-bv-2 text-body text-bv-navy/72">
              4 etapas. Salve quando quiser, retome depois. Aprovação em até 48h úteis.
            </p>
          </header>

          <PartnerSignupWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
