import Link from 'next/link';
import {
  Search as SearchIcon,
  Sparkles,
  ShieldCheck,
  Award,
  TrendingDown,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading, BicolorHighlight } from '@/components/ui/bicolor-heading';
import { JourneyTag } from '@/components/ui/journey-tag';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchForm } from '@/components/feature/search-form';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getCurrentUser();
  const userMeta = user ? { firstName: user.firstName } : null;

  return (
    <>
      <Navbar user={userMeta} />

      <main id="main">
      {/* HERO */}
      <section className="bv-canvas relative">
        <div className="container mx-auto max-w-bv-container px-bv-5 pt-bv-7 md:pt-bv-9 pb-bv-9">
          <div className="max-w-3xl">
            <JourneyTag size="sm" className="mb-bv-4 md:hidden" />
            <JourneyTag size="md" className="mb-bv-5 hidden md:inline-flex" />
            <h1 className="font-heading font-black leading-tight text-h1 md:text-display tracking-tight mb-bv-4">
              <span className="text-bv-navy">Encontre sua </span>
              <span className="text-bv-green">próxima viagem</span>
              <span className="text-bv-navy">.</span>
            </h1>
            <p className="text-body md:text-body-lg text-bv-navy/72 max-w-2xl">
              Compare em segundos preços de fretamento de dezenas de empresas.
              Reserve em poucos cliques. Sem complicação.
            </p>
          </div>

          <div className="mt-bv-6 md:mt-bv-7">
            <SearchForm variant="hero" />
          </div>

          <div className="mt-bv-5 flex flex-wrap items-center gap-bv-5 text-body-sm text-bv-navy/72">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={16} className="text-bv-green" strokeWidth={2.5} />
              Empresas verificadas
            </span>
            <span className="inline-flex items-center gap-1">
              <Award size={16} className="text-bv-green" strokeWidth={2.5} />
              Pagamento seguro
            </span>
            <span className="inline-flex items-center gap-1">
              <TrendingDown size={16} className="text-bv-green" strokeWidth={2.5} />
              Melhor preço garantido
            </span>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-white py-bv-9 md:py-[120px]">
        <div className="container mx-auto max-w-bv-container px-bv-5">
          <BicolorHeading as="h2" size="h1" className="mb-bv-2">
            Em 3 passos.{' '}
            <BicolorHighlight>Sem complicação.</BicolorHighlight>
          </BicolorHeading>
          <p className="text-body-lg text-bv-navy/72 max-w-2xl mb-bv-8">
            Buscar, encontrar e viajar nunca foi tão simples.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-bv-6">
            <Step
              number="1"
              title="Buscou"
              description="Diga onde, quando e quantos vão. Mostramos veículos de várias empresas lado a lado."
            />
            <Step
              number="2"
              title="Encontrou"
              description="Compare preços, comodidades e avaliações. Filtros pra refinar sua escolha em segundos."
              highlight
            />
            <Step
              number="3"
              title="Viajou"
              description="Reserve em poucos cliques. Receba seu bilhete digital com QR Code. Boa viagem."
            />
          </div>
        </div>
      </section>

      {/* VALORES — referência ao manual da marca pág. 3 */}
      <section className="bg-bv-bg py-bv-9 md:py-[120px]">
        <div className="container mx-auto max-w-bv-container px-bv-5">
          <BicolorHeading as="h2" size="h1" className="mb-bv-2">
            Princípios que nos{' '}
            <BicolorHighlight>guiam.</BicolorHighlight>
          </BicolorHeading>
          <p className="text-body-lg text-bv-navy/72 max-w-2xl mb-bv-8">
            Três valores que orientam cada decisão de produto.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-bv-6">
            <Card variant="outline" padding="lg">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-bv-green-50 text-bv-green-700 mb-bv-4">
                <SearchIcon size={24} strokeWidth={2} />
              </span>
              <CardTitle>Simplicidade</CardTitle>
              <CardDescription className="mt-bv-2">
                Viajar deve ser fácil. Soluções intuitivas pra você encontrar, comparar e
                reservar sem complicação.
              </CardDescription>
            </Card>

            <Card variant="accent" padding="lg">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-white/15 text-white mb-bv-4">
                <Sparkles size={24} strokeWidth={2} />
              </span>
              <CardTitle className="text-white">Inovação</CardTitle>
              <CardDescription className="text-white/85 mt-bv-2">
                Pricing dinâmico, bilhete digital, busca instantânea. Tecnologia pra
                acelerar sua jornada.
              </CardDescription>
            </Card>

            <Card variant="brand" padding="lg">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-white/15 text-white mb-bv-4">
                <Award size={24} strokeWidth={2} />
              </span>
              <CardTitle className="text-white">Conexão</CardTitle>
              <CardDescription className="text-white/85 mt-bv-2">
                Conectamos você a empresas verificadas em todo o Brasil. Rede confiável,
                viagens seguras.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* PARA EMPRESAS */}
      <section id="para-empresas" className="bg-white py-bv-9 md:py-[120px] border-t border-bv-navy/8">
        <div className="container mx-auto max-w-bv-container px-bv-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-bv-6 items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-bv-pill bg-bv-navy-50 text-bv-navy-700 text-caption font-semibold px-3 py-1 mb-bv-4">
                <Building2 size={14} strokeWidth={2.5} />
                Pra donos de empresa
              </span>
              <BicolorHeading as="h2" size="h1" className="mb-bv-3">
                Tem uma frota?{' '}
                <BicolorHighlight>Coloque na plataforma.</BicolorHighlight>
              </BicolorHeading>
              <p className="text-body-lg text-bv-navy/72 mb-bv-6">
                Empresas de fretamento conectadas a milhares de clientes em todo o Brasil.
                Painel próprio pra acompanhar sua frota, avaliações e desempenho — sem mensalidade
                escondida, sem letra miúda.
              </p>
              <ul className="space-y-bv-2 mb-bv-6 text-body text-bv-navy/80">
                <li className="inline-flex items-start gap-2">
                  <ShieldCheck size={18} strokeWidth={2.5} className="text-bv-green mt-0.5 shrink-0" />
                  Cadastro 100% online, aprovação em até 48h
                </li>
                <li className="inline-flex items-start gap-2">
                  <Award size={18} strokeWidth={2.5} className="text-bv-green mt-0.5 shrink-0" />
                  Painel com sua frota, avaliações e indicadores
                </li>
                <li className="inline-flex items-start gap-2">
                  <TrendingDown size={18} strokeWidth={2.5} className="text-bv-green mt-0.5 shrink-0" />
                  Pricing dinâmico — você fatura mais em alta temporada
                </li>
              </ul>
              <div className="flex flex-wrap gap-bv-3">
                <Button asChild variant="primary" size="lg" iconRight={<ArrowRight size={16} />}>
                  <Link href="/empresa/login">Acessar painel da empresa</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/seja-parceiro">Cadastrar minha empresa</Link>
                </Button>
              </div>
              <p className="mt-bv-4 text-body-sm text-bv-navy/72">
                Já é parceiro? Entre direto no{' '}
                <Link
                  href="/empresa/login"
                  className="font-semibold text-bv-green hover:text-bv-green-700 underline underline-offset-4"
                >
                  painel da empresa
                </Link>
                .
              </p>
            </div>

            <Card variant="brand" padding="lg" className="hidden lg:block max-w-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-bv-md bg-white/15 text-white mb-bv-4">
                <Building2 size={24} strokeWidth={2} />
              </span>
              <CardTitle className="text-white">Sua frota, no seu painel</CardTitle>
              <CardDescription className="text-white/85 mt-bv-2">
                Acompanhe veículos, avaliações e regiões de atuação. Edição completa
                vem em breve.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA fechamento */}
      <section className="bg-bv-navy text-white py-bv-9 md:py-[120px]">
        <div className="container mx-auto max-w-bv-container px-bv-5 text-center max-w-3xl">
          <h2 className="font-heading font-bold text-h1 leading-tight mb-bv-4">
            Pronto pra <span className="text-bv-green-300">primeira viagem?</span>
          </h2>
          <p className="text-body-lg text-white/80 mb-bv-6 max-w-xl mx-auto">
            Encontre o veículo certo agora mesmo. Sem cadastro pra buscar.
          </p>
          <Button asChild variant="accent" size="lg">
            <Link href="#top">Buscar viagens</Link>
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
  title,
  description,
  highlight,
}: {
  number: string;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-bv-md bg-bv-green text-white p-bv-6'
          : 'rounded-bv-md bg-white border border-bv-navy/8 p-bv-6'
      }
    >
      <span
        className={
          highlight
            ? 'inline-flex h-10 w-10 items-center justify-center rounded-bv-pill bg-white/20 text-white font-heading font-black text-h4'
            : 'inline-flex h-10 w-10 items-center justify-center rounded-bv-pill bg-bv-navy text-white font-heading font-black text-h4'
        }
      >
        {number}
      </span>
      <h3
        className={
          highlight
            ? 'mt-bv-4 font-heading font-bold text-h3 text-white'
            : 'mt-bv-4 font-heading font-bold text-h3 text-bv-navy'
        }
      >
        {title}
      </h3>
      <p
        className={
          highlight
            ? 'mt-bv-2 text-body text-white/85'
            : 'mt-bv-2 text-body text-bv-navy/72'
        }
      >
        {description}
      </p>
    </div>
  );
}
