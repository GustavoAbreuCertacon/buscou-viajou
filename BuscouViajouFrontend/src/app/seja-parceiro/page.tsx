import Link from 'next/link';
import type { Metadata } from 'next';
import { Bus, Wallet, Users, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading, BicolorHighlight } from '@/components/ui/bicolor-heading';
import { Button } from '@/components/ui/button';
import { JourneyTag } from '@/components/ui/journey-tag';
import { CartographicTicks } from '@/components/feature/landing/cartographic-ticks';
import { SectionEyebrow } from '@/components/feature/landing/section-eyebrow';
import { getCurrentUser } from '@/lib/auth/get-current-user';

export const metadata: Metadata = {
  title: 'Seja Parceiro — Anuncie sua frota no Buscou Viajou',
  description:
    'Tem ônibus, vans ou micro-ônibus parados? Anuncie sua frota no Buscou Viajou e conecte-se a quem está buscando. Sem mensalidade.',
  alternates: { canonical: '/seja-parceiro' },
};

const BENEFITS = [
  {
    icon: Bus,
    title: 'Sua frota visível',
    description:
      'Veículos aparecem nas buscas sempre que houver demanda compatível na rota.',
  },
  {
    icon: Wallet,
    title: 'Sem mensalidade',
    description:
      'Cobramos só uma taxa de serviço por reserva fechada. Zero risco de entrar.',
  },
  {
    icon: Users,
    title: 'Painel próprio',
    description:
      'Gerencie reservas, motoristas e disponibilidade no painel da empresa (em breve).',
  },
];

export default async function SejaParceiroPage() {
  const user = await getCurrentUser();
  const userMeta = user ? { firstName: user.firstName } : null;

  return (
    <>
      <Navbar user={userMeta} />

      <main id="main">
        {/* HERO */}
        <section className="bv-canvas relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[280px] h-[180px] pointer-events-none hidden md:block"
            aria-hidden
          >
            <CartographicTicks position="top-right" className="w-full h-full" />
          </div>

          <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-9 md:py-[120px] relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-bv-7 items-start">
              <div className="lg:col-span-7 max-w-2xl">
                <SectionEyebrow number="B2B" label="Para empresas" />
                <h1 className="mt-bv-3 font-heading font-black text-h1 md:text-display leading-[1.05] tracking-tight">
                  <span className="text-bv-navy">Sua frota, </span>
                  <span className="text-bv-green">mais demanda.</span>
                </h1>
                <p className="mt-bv-5 text-body-lg md:text-h4 text-bv-navy/72 leading-relaxed">
                  Anuncie ônibus, vans e micro-ônibus no Buscou Viajou.
                  Conecte-se a passageiros e grupos buscando fretamento em
                  todo o Brasil.
                </p>

                <ul className="mt-bv-7 space-y-bv-4 max-w-xl">
                  {BENEFITS.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="flex items-start gap-bv-4">
                      <span className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-bv-green-50 text-bv-green-700">
                        <Icon size={22} strokeWidth={2} aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-heading font-bold text-h4 text-bv-navy leading-snug">
                          {title}
                        </h3>
                        <p className="mt-bv-1 text-body text-bv-navy/72">
                          {description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-bv-7">
                  <JourneyTag size="md" />
                </div>
              </div>

              {/* CTA column — direciona pro cadastro completo */}
              <div className="lg:col-span-5">
                <div className="rounded-bv-lg bg-white border border-bv-navy/12 shadow-bv-md p-bv-6 md:p-bv-7">
                  <header className="mb-bv-5">
                    <p className="text-caption font-bold uppercase tracking-[0.14em] text-bv-green-700">
                      Cadastro completo
                    </p>
                    <BicolorHeading as="h2" size="h3" className="mt-bv-2">
                      <BicolorHighlight>4 etapas.</BicolorHighlight> 100% online.
                    </BicolorHeading>
                    <p className="mt-bv-2 text-body-sm text-bv-navy/72">
                      Empresa, responsável, frota e aceite do código de conduta.
                      Aprovação em até 48h úteis.
                    </p>
                  </header>

                  <ol className="space-y-bv-3 mb-bv-5">
                    {[
                      { num: '01', icon: Users, label: 'Dados da empresa' },
                      { num: '02', icon: ShieldCheck, label: 'Responsável legal' },
                      { num: '03', icon: FileText, label: 'Documentos e frota' },
                      { num: '04', icon: CheckCircle2, label: 'Aceite do código de conduta' },
                    ].map(({ num, icon: Icon, label }) => (
                      <li key={num} className="flex items-center gap-bv-3 text-body-sm text-bv-navy/80">
                        <span className="font-mono text-caption font-bold text-bv-green-700 w-6 shrink-0">
                          {num}
                        </span>
                        <Icon size={16} strokeWidth={2} className="text-bv-navy/48 shrink-0" />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ol>

                  <Button asChild variant="accent" size="lg" fullWidth iconRight={<ArrowRight size={16} />}>
                    <Link href="/seja-parceiro/cadastro">Começar cadastro</Link>
                  </Button>

                  <p className="mt-bv-3 text-caption text-bv-navy/60 text-center">
                    Já é parceiro?{' '}
                    <Link
                      href="/empresa/login"
                      className="font-semibold text-bv-green hover:text-bv-green-700 underline underline-offset-4"
                    >
                      Acessar painel
                    </Link>
                  </p>
                </div>

                <p className="mt-bv-4 text-caption text-bv-navy/72 text-center">
                  Documentos (Contrato Social, Alvará, ANTT) podem ser enviados depois,
                  durante a análise.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
