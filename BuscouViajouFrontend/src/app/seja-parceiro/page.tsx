import Link from 'next/link';
import {
  ShieldCheck,
  TrendingDown,
  Award,
  ArrowRight,
  Users,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading, BicolorHighlight } from '@/components/ui/bicolor-heading';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { JourneyTag } from '@/components/ui/journey-tag';

export const metadata = {
  title: 'Seja parceiro — Buscou Viajou',
  description:
    'Coloque sua frota no maior comparador de fretamento turístico do Brasil. Cadastro 100% online, aprovação em até 48h.',
};

export default function SejaParceiroPage() {
  return (
    <>
      <Navbar />

      <main id="main">
        {/* HERO */}
        <section className="bv-canvas">
          <div className="container mx-auto max-w-bv-container px-bv-5 pt-bv-7 md:pt-bv-9 pb-bv-7 md:pb-bv-9">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-bv-pill bg-bv-navy-50 text-bv-navy-700 text-caption font-semibold px-3 py-1 mb-bv-4">
                Empresas parceiras
              </span>
              <BicolorHeading as="h1" size="display" className="mb-bv-4">
                Coloque sua frota no{' '}
                <BicolorHighlight>maior comparador</BicolorHighlight> de fretamento do Brasil.
              </BicolorHeading>
              <p className="text-body-lg text-bv-navy/72 mb-bv-6 max-w-2xl">
                Cadastro 100% online em 4 etapas. Aprovação em até 48h. Painel pronto pra
                gerir sua frota, avaliações e desempenho.
              </p>
              <div className="flex flex-wrap gap-bv-3">
                <Button asChild variant="accent" size="lg" iconRight={<ArrowRight size={16} />}>
                  <Link href="/seja-parceiro/cadastro">Começar cadastro</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/empresa/login">Já sou parceiro · Acessar painel</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="bg-white py-bv-9 md:py-[120px]">
          <div className="container mx-auto max-w-bv-container px-bv-5">
            <BicolorHeading as="h2" size="h1" className="mb-bv-2">
              Crescimento <BicolorHighlight>sem letra miúda.</BicolorHighlight>
            </BicolorHeading>
            <p className="text-body-lg text-bv-navy/72 mb-bv-8 max-w-2xl">
              Conexão direta com clientes em todo o país, sem complicação contratual.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-bv-6">
              <Card variant="outline" padding="lg">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-bv-green-50 text-bv-green-700 mb-bv-4">
                  <ShieldCheck size={24} strokeWidth={2} />
                </span>
                <CardTitle>Cadastro simples</CardTitle>
                <CardDescription className="mt-bv-2">
                  4 etapas guiadas, totalmente online. Você envia os documentos e nosso
                  time analisa em até 48h úteis.
                </CardDescription>
              </Card>

              <Card variant="accent" padding="lg">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-white/15 text-white mb-bv-4">
                  <TrendingDown size={24} strokeWidth={2} />
                </span>
                <CardTitle className="text-white">Pricing dinâmico</CardTitle>
                <CardDescription className="text-white/85 mt-bv-2">
                  Em alta temporada o preço sobe sozinho. Em baixa, ajusta pra ocupar a
                  frota. Você fatura mais e nem precisa pensar.
                </CardDescription>
              </Card>

              <Card variant="brand" padding="lg">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-white/15 text-white mb-bv-4">
                  <Award size={24} strokeWidth={2} />
                </span>
                <CardTitle className="text-white">Painel completo</CardTitle>
                <CardDescription className="text-white/85 mt-bv-2">
                  Acompanhe sua frota, avaliações, regiões de atuação e desempenho em
                  um único painel.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="bg-bv-bg py-bv-9 md:py-[120px]">
          <div className="container mx-auto max-w-bv-container px-bv-5">
            <BicolorHeading as="h2" size="h1" className="mb-bv-2">
              Em <BicolorHighlight>4 passos</BicolorHighlight> você está vendendo.
            </BicolorHeading>
            <p className="text-body-lg text-bv-navy/72 mb-bv-8 max-w-2xl">
              O processo todo é digital. Sem fila, sem visita, sem papelada extra.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-bv-4">
              <Step
                number="1"
                icon={<Users size={20} strokeWidth={2} />}
                title="Conte da empresa"
                description="Razão social, CNPJ, endereço e telefone."
              />
              <Step
                number="2"
                icon={<ShieldCheck size={20} strokeWidth={2} />}
                title="Identifique-se"
                description="Você é o responsável legal — CPF, e-mail e cargo."
              />
              <Step
                number="3"
                icon={<FileText size={20} strokeWidth={2} />}
                title="Envie os documentos"
                description="Contrato social, alvará e ANTT em PDF. Detalhe sua frota."
              />
              <Step
                number="4"
                icon={<CheckCircle2 size={20} strokeWidth={2} />}
                title="Aceite e envie"
                description="Leia o código de conduta, aceite e envie o cadastro."
              />
            </div>
          </div>
        </section>

        {/* CTA fechamento */}
        <section className="bg-bv-navy text-white py-bv-9 md:py-[120px]">
          <div className="container mx-auto max-w-bv-container px-bv-5 text-center max-w-3xl">
            <h2 className="font-heading font-bold text-h1 leading-tight mb-bv-4">
              Pronto pra <span className="text-bv-green-300">mostrar sua frota?</span>
            </h2>
            <p className="text-body-lg text-white/80 mb-bv-6 max-w-xl mx-auto">
              Leva uns 10 minutos. Você pode salvar e voltar depois.
            </p>
            <Button asChild variant="accent" size="lg">
              <Link href="/seja-parceiro/cadastro">Começar agora</Link>
            </Button>
            <div className="mt-bv-6">
              <JourneyTag size="md" inverse />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-bv-md bg-white border border-bv-navy/8 p-bv-5">
      <div className="flex items-center gap-bv-2 mb-bv-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-bv-pill bg-bv-navy text-white font-heading font-black text-body-sm">
          {number}
        </span>
        <span className="text-bv-green">{icon}</span>
      </div>
      <h3 className="font-heading font-bold text-body text-bv-navy mb-bv-1">{title}</h3>
      <p className="text-body-sm text-bv-navy/72 leading-snug">{description}</p>
    </div>
  );
}
