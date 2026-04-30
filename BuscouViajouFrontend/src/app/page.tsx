import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Search as SearchIcon,
  Compass,
  Ticket,
  ShieldCheck,
  Award,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';

import { getCurrentUser } from '@/lib/auth/get-current-user';
import { api } from '@/lib/api/client';
import type {
  Company,
  CompaniesResponse,
  ReviewsResponse,
  CompanyReview,
} from '@/lib/api/types';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading, BicolorHighlight } from '@/components/ui/bicolor-heading';
import { JourneyTag } from '@/components/ui/journey-tag';
import { Button } from '@/components/ui/button';
import { SearchForm } from '@/components/feature/search-form';

import { SectionEyebrow } from '@/components/feature/landing/section-eyebrow';
import { CartographicTicks } from '@/components/feature/landing/cartographic-ticks';
import { RouteCard } from '@/components/feature/landing/route-card';
import { QuickRouteChips } from '@/components/feature/landing/quick-route-chips';
import { CompareMatrix } from '@/components/feature/landing/compare-matrix';
import { CompanyStrip } from '@/components/feature/landing/company-strip';
import { StatTrio } from '@/components/feature/landing/stat-trio';
import { TestimonialCard } from '@/components/feature/landing/testimonial-card';
import { FaqAccordion, type FaqItem } from '@/components/feature/landing/faq-accordion';
import { B2bCallout } from '@/components/feature/landing/b2b-callout';
import { Reveal } from '@/components/feature/landing/reveal';
import { CURATED_ROUTES } from '@/components/feature/landing/curated-routes';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buscou Viajou — Compare fretamento de ônibus, vans e micro-ônibus',
  description:
    'Compare em uma só tela vans, micro-ônibus e ônibus de empresas verificadas em todo o Brasil. Cotação em segundos — depois fale direto com a empresa.',
  openGraph: {
    title: 'Buscou Viajou — Compare fretamento turístico',
    description:
      'Plataforma de comparação de preços de fretamento turístico do Brasil. Vans, micro-ônibus e ônibus de empresas verificadas — cotação em segundos.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Buscou Viajou',
  },
  alternates: { canonical: '/' },
};

// ────────────────────────────────────────────────────────────────────────────
// FAQ — conteúdo
// ────────────────────────────────────────────────────────────────────────────

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'sobre',
    question: 'O que é a Buscou Viajou?',
    answer: (
      <p>
        Somos uma{' '}
        <strong className="text-bv-navy">
          plataforma de tecnologia e comparação de preços
        </strong>
        . Nosso papel é reunir em um só lugar diversas empresas de turismo
        para que você possa comparar valores e serviços de forma rápida.
        Não somos uma empresa de transporte ou operadora de viagens, mas sim
        o facilitador da sua busca.
      </p>
    ),
  },
  {
    id: 'responsabilidade',
    question: 'A Buscou Viajou é responsável pela minha viagem?',
    answer: (
      <p>
        <strong className="text-bv-navy">Não.</strong> A responsabilidade
        integral pela execução do transporte, condições do veículo,
        cumprimento de horários, seguros e segurança dos passageiros é
        exclusiva da empresa de turismo que você escolher e contratar
        através do nosso comparador.
      </p>
    ),
  },
  {
    id: 'reserva-pagamento',
    question: 'Com quem eu faço o pagamento e a reserva?',
    answer: (
      <p>
        O fechamento da reserva e o pagamento são realizados{' '}
        <strong className="text-bv-navy">
          diretamente com a empresa de turismo escolhida
        </strong>
        . A Buscou Viajou apenas apresenta as opções de mercado.
        Certifique-se de conferir os termos de contrato da empresa antes
        de finalizar o pagamento.
      </p>
    ),
  },
  {
    id: 'cancelamento-atraso',
    question: 'O que acontece se a viagem for cancelada ou houver atraso?',
    answer: (
      <p>
        Nesses casos, você deve entrar em contato diretamente com o{' '}
        <strong className="text-bv-navy">
          suporte da empresa de turismo contratada
        </strong>
        . Como somos apenas um buscador, não temos gerência sobre a frota
        ou escala das empresas parceiras.
      </p>
    ),
  },
  {
    id: 'preco-garantido',
    question: 'O preço no site é garantido?',
    answer: (
      <p>
        Os preços e disponibilidades são atualizados em tempo real pelas
        próprias empresas parceiras através de nossa área do cliente. Caso
        haja qualquer divergência no momento da finalização, o valor válido
        será sempre o{' '}
        <strong className="text-bv-navy">
          confirmado pela empresa prestadora do serviço
        </strong>
        .
      </p>
    ),
  },
  {
    id: 'qualidade',
    question: 'Como vocês garantem a qualidade das empresas cadastradas?',
    answer: (
      <p>
        Monitoramos constantemente a satisfação dos usuários através de um
        sistema de avaliações. Empresas que não mantêm um padrão mínimo de
        qualidade ou recebem reclamações recorrentes são{' '}
        <strong className="text-bv-navy">
          notificadas e podem ser excluídas
        </strong>{' '}
        da plataforma para garantir a sua segurança.
      </p>
    ),
  },
  {
    id: 'privacidade-lgpd',
    question: 'Meus dados estão seguros na plataforma?',
    answer: (
      <p>
        Sim. Operamos em total conformidade com a{' '}
        <strong className="text-bv-navy">
          Lei Geral de Proteção de Dados (LGPD)
        </strong>
        . Seus dados de contato só serão compartilhados com a empresa de
        turismo caso você demonstre interesse em uma oferta específica,
        para viabilizar o seu atendimento.
      </p>
    ),
  },
  {
    id: 'problema-empresa',
    question: 'Tive um problema com a empresa de turismo. O que fazer?',
    answer: (
      <p>
        Recomendamos que tente resolver diretamente com o{' '}
        <strong className="text-bv-navy">SAC da empresa</strong>. Caso não
        obtenha solução, você pode{' '}
        <a
          href="mailto:contato@buscouviajou.demo"
          className="text-bv-green font-semibold underline underline-offset-4 hover:text-bv-green-700"
        >
          registrar uma avaliação
        </a>{' '}
        na nossa plataforma para que nossa equipe de qualidade analise a
        conduta do parceiro.
      </p>
    ),
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Como funciona — passos
// ────────────────────────────────────────────────────────────────────────────

const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'Buscou',
    description:
      'Diga a origem, destino, data e quantos vão. A gente conecta com várias empresas de uma vez.',
    icon: SearchIcon,
    highlight: false,
  },
  {
    number: '02',
    title: 'Encontrou',
    description:
      'Compare preços, comodidades e avaliações lado a lado. Filtros refinam a escolha em segundos.',
    icon: Compass,
    highlight: true,
  },
  {
    number: '03',
    title: 'Viajou',
    description:
      'Fale direto com a empresa escolhida e feche a reserva. Boa viagem.',
    icon: Ticket,
    highlight: false,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Helpers de fetch + dados
// ────────────────────────────────────────────────────────────────────────────

async function fetchCompaniesSafely(): Promise<Company[]> {
  try {
    const res = await api<CompaniesResponse>('/v1/companies', {
      auth: false,
      cache: 'no-store',
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

async function fetchTopTestimonials(companies: Company[]): Promise<CompanyReview[]> {
  if (companies.length === 0) return [];
  const sorted = [...companies].sort((a, b) => b.average_rating - a.average_rating);
  const topIds = sorted.slice(0, 4).map((c) => c.id);

  const batches = await Promise.all(
    topIds.map((id) =>
      api<ReviewsResponse>(`/v1/companies/${id}/reviews`, {
        auth: false,
        cache: 'no-store',
      }).catch(() => ({ data: [] as CompanyReview[] })),
    ),
  );

  const seen = new Set<string>();
  const flat = batches
    .flatMap((b) => b.data)
    .filter((r) => r.comment && r.client?.first_name && r.overall_rating >= 4)
    // dedup por comentário (seed às vezes repete)
    .filter((r) => {
      const key = (r.comment || '').trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.overall_rating - a.overall_rating);

  return flat.slice(0, 3);
}

function countCompaniesForRoute(
  route: { origin: { state: string }; destination: { state: string } },
  companies: Company[],
): number {
  const states = new Set([route.origin.state, route.destination.state]);
  return companies.filter((c) =>
    c.operating_regions.some((r) => states.has(r)),
  ).length;
}

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const user = await getCurrentUser();
  const userMeta = user ? { firstName: user.firstName } : null;

  // Fetches em paralelo, com fallback gracioso
  const companies = await fetchCompaniesSafely();
  const testimonials = await fetchTopTestimonials(companies);

  // Agregados reais
  const totalReviews = companies.reduce((s, c) => s + c.total_reviews, 0);
  const totalStates = new Set(
    companies.flatMap((c) => c.operating_regions),
  ).size;
  const totalCompanies = companies.length;
  const VEHICLES_AVAILABLE = 25; // hard-coded — não há endpoint de stats no MVP

  // JSON-LD pra SEO
  const baseUrl = 'https://buscouviajou.com.br';
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Buscou Viajou',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/busca?origem={origin}&destino={destination}`,
        },
        'query-input': [
          'required name=origin',
          'required name=destination',
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Buscou Viajou',
      url: baseUrl,
      slogan: 'Buscou → Encontrou → Viajou',
      // Plataforma de intermediação digital — não é prestadora do serviço.
      // Por isso NÃO atribuímos aggregateRating à organização (as avaliações
      // pertencem às empresas parceiras individualmente).
      description:
        'Plataforma de intermediação digital e comparação de preços de fretamento turístico no Brasil. Compare vans, micro-ônibus e ônibus de empresas parceiras.',
      areaServed: 'BR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faqAnswerText(item.id),
        },
      })),
    },
  ];

  return (
    <>
      <Navbar user={userMeta} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main">
        {/* ════════════════════════════════════════════════════════════════
            HERO
            ════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="hero-heading"
          className="bv-canvas relative overflow-hidden"
        >
          {/* Decorações cartográficas — atrás, sutis, não interativas */}
          <div
            className="absolute top-0 right-0 w-[280px] h-[180px] pointer-events-none hidden md:block"
            aria-hidden
          >
            <CartographicTicks position="top-right" className="w-full h-full" />
          </div>
          <div
            className="absolute bottom-0 left-0 w-[220px] h-[140px] pointer-events-none hidden md:block opacity-80"
            aria-hidden
          >
            <CartographicTicks position="bottom-left" className="w-full h-full" />
          </div>

          <div className="container mx-auto max-w-bv-container px-bv-5 pt-bv-7 md:pt-bv-9 pb-bv-9 relative">
            <div className="bv-stagger">
              <JourneyTag size="md" />

              <h1
                id="hero-heading"
                className="max-w-3xl mt-bv-5 font-heading font-black leading-[1.05] text-h1 md:text-display tracking-tight"
              >
                <span className="text-bv-navy">Compare </span>
                <span className="text-bv-green">fretamentos</span>
                <span className="text-bv-navy"> lado a lado.</span>
                <br className="hidden md:block" />
                <span className="text-bv-navy"> Encontre em minutos.</span>
              </h1>

              <p className="max-w-2xl mt-bv-5 text-body-lg md:text-h4 text-bv-navy/72 leading-relaxed">
                Vans, micro-ônibus e ônibus de empresas verificadas em todo o
                Brasil. Compare preços, avaliações e comodidades em uma só
                tela — depois fale direto com a empresa que melhor atende.
              </p>

              <div className="mt-bv-6 md:mt-bv-7">
                <SearchForm variant="hero" />
              </div>
            </div>

            {/* Trust mini + Quick chips */}
            <div className="mt-bv-6 md:mt-bv-7 flex flex-col gap-bv-5">
              <ul
                className="flex flex-wrap items-center gap-x-bv-5 gap-y-bv-3 text-body-sm text-bv-navy/72"
                aria-label="Garantias"
              >
                <li className="inline-flex items-center gap-bv-2">
                  <ShieldCheck size={18} className="text-bv-green" strokeWidth={2.5} aria-hidden />
                  <span>
                    {totalCompanies > 0
                      ? `${totalCompanies} empresas verificadas`
                      : 'Empresas verificadas'}
                  </span>
                </li>
                <li className="inline-flex items-center gap-bv-2">
                  <Award size={18} className="text-bv-green" strokeWidth={2.5} aria-hidden />
                  <span>
                    {totalReviews > 0
                      ? `${totalReviews.toLocaleString('pt-BR')}+ avaliações`
                      : 'Pagamento seguro'}
                  </span>
                </li>
                <li className="inline-flex items-center gap-bv-2">
                  <TrendingDown size={18} className="text-bv-green" strokeWidth={2.5} aria-hidden />
                  <span>Cobertura nacional</span>
                </li>
              </ul>

              <QuickRouteChips />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            01 — DESTINOS — Rotas em alta
            ════════════════════════════════════════════════════════════════ */}
        <Reveal as="section" className="bg-white py-bv-9 md:py-[120px]">
          <div className="container mx-auto max-w-bv-container px-bv-5">
            <header className="max-w-3xl">
              <SectionEyebrow number="01" label="Destinos" />
              <BicolorHeading as="h2" size="h1" className="mt-bv-3">
                Rotas mais{' '}
                <BicolorHighlight>buscadas</BicolorHighlight> no Brasil.
              </BicolorHeading>
              <p className="mt-bv-3 text-body-lg text-bv-navy/72 max-w-2xl">
                Pontos de partida e chegada com maior demanda nesta temporada.
                Clique e veja os veículos disponíveis em segundos.
              </p>
            </header>

            <div className="mt-bv-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-bv-5">
              {CURATED_ROUTES.map((route) => (
                <RouteCard
                  key={`${route.origin.name}-${route.destination.name}`}
                  route={route}
                  companiesCount={countCompaniesForRoute(route, companies)}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ════════════════════════════════════════════════════════════════
            02 — COMO FUNCIONA
            ════════════════════════════════════════════════════════════════ */}
        <Reveal as="section" id="como-funciona" className="bg-bv-bg py-bv-9 md:py-[120px] relative overflow-hidden">
          <div className="container mx-auto max-w-bv-container px-bv-5">
            <header className="max-w-3xl">
              <SectionEyebrow number="02" label="Como funciona" />
              <BicolorHeading as="h2" size="h1" className="mt-bv-3">
                Da busca ao{' '}
                <BicolorHighlight>embarque</BicolorHighlight>, em três passos.
              </BicolorHeading>
            </header>

            {/* Linha de rota SVG conectando os 3 passos (desktop only) */}
            <div className="mt-bv-8 relative">
              <svg
                aria-hidden
                className="hidden md:block absolute inset-x-0 top-12 h-2 w-full pointer-events-none text-bv-navy/16"
                viewBox="0 0 1200 8"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="4"
                  x2="1200"
                  y2="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 8"
                />
              </svg>

              <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-bv-6">
                {HOW_IT_WORKS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const offsetClass =
                    idx === 1 ? 'md:translate-y-bv-5' : idx === 2 ? 'md:translate-y-bv-7' : '';
                  return (
                    <li
                      key={step.number}
                      className={`relative ${offsetClass} transition-transform duration-bv-base`}
                    >
                      <div
                        className={`relative rounded-bv-lg p-bv-6 md:p-bv-7 ${
                          step.highlight
                            ? 'bg-bv-green text-white shadow-bv-lg'
                            : 'bg-white border border-bv-navy/12 shadow-bv-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-heading font-black tabular-nums leading-none text-h2 ${
                              step.highlight ? 'text-white/30' : 'text-bv-navy/24'
                            }`}
                          >
                            {step.number}
                          </span>
                          <span
                            className={`inline-flex h-12 w-12 items-center justify-center rounded-bv-pill ${
                              step.highlight ? 'bg-white/15 text-white' : 'bg-bv-green-50 text-bv-green'
                            }`}
                          >
                            <Icon size={22} strokeWidth={2} aria-hidden />
                          </span>
                        </div>
                        <h3
                          className={`mt-bv-5 font-heading font-bold text-h2 leading-tight ${
                            step.highlight ? 'text-white' : 'text-bv-navy'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`mt-bv-3 text-body leading-relaxed ${
                            step.highlight ? 'text-white/85' : 'text-bv-navy/72'
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* ════════════════════════════════════════════════════════════════
            03 — DIFERENCIAL — Por que comparar
            ════════════════════════════════════════════════════════════════ */}
        <Reveal as="section" className="bg-white py-bv-9 md:py-[120px]">
          <div className="container mx-auto max-w-bv-container px-bv-5">
            <header className="max-w-3xl">
              <SectionEyebrow number="03" label="Diferencial" />
              <BicolorHeading as="h2" size="h1" className="mt-bv-3">
                Pare de ligar.{' '}
                <BicolorHighlight>Compare aqui.</BicolorHighlight>
              </BicolorHeading>
              <p className="mt-bv-3 text-body-lg text-bv-navy/72 max-w-2xl">
                Cotar fretamento com cada empresa na mão toma horas e nunca
                permite comparação real. Aqui é tudo na mesma tela, em segundos.
              </p>
            </header>

            <div className="mt-bv-7">
              <CompareMatrix />
            </div>

            <p className="mt-bv-5 text-body-sm text-bv-navy/72">
              <Link
                href="#como-funciona"
                className="inline-flex items-center gap-bv-1 text-bv-green font-semibold hover:text-bv-green-700 underline underline-offset-4"
              >
                Veja como funciona
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
              </Link>
            </p>
          </div>
        </Reveal>

        {/* ════════════════════════════════════════════════════════════════
            04 — REDE — Empresas + Stats
            ════════════════════════════════════════════════════════════════ */}
        {totalCompanies > 0 && (
          <Reveal as="section" className="bg-bv-bg py-bv-9 md:py-[120px]">
            <div className="container mx-auto max-w-bv-container px-bv-5">
              <header className="max-w-3xl">
                <SectionEyebrow number="04" label="Rede" />
                <BicolorHeading as="h2" size="h1" className="mt-bv-3">
                  <BicolorHighlight>{totalCompanies} empresas</BicolorHighlight>{' '}
                  verificadas. Cobertura nacional.
                </BicolorHeading>
                <p className="mt-bv-3 text-body-lg text-bv-navy/72 max-w-2xl">
                  Frota dedicada, motoristas treinados, documentação em ordem.
                  Cada empresa passa por um processo de verificação antes de
                  entrar na rede.
                </p>
              </header>

              <div className="mt-bv-7">
                <CompanyStrip companies={companies} />
              </div>

              <div className="mt-bv-9 pt-bv-7 border-t border-bv-navy/12">
                <StatTrio
                  stats={[
                    {
                      value: String(VEHICLES_AVAILABLE),
                      label: 'veículos disponíveis',
                      caption: 'Vans, micro-ônibus e ônibus.',
                    },
                    {
                      value: totalReviews.toLocaleString('pt-BR'),
                      label: 'avaliações verificadas',
                      caption: 'De viajantes que já contrataram pelas empresas.',
                    },
                    {
                      value: String(totalStates),
                      label: 'estados atendidos',
                      caption: 'Do Sul ao Nordeste.',
                    },
                  ]}
                />
              </div>
            </div>
          </Reveal>
        )}

        {/* ════════════════════════════════════════════════════════════════
            05 — VOZES — Avaliações reais
            ════════════════════════════════════════════════════════════════ */}
        {testimonials.length >= 2 && (
          <Reveal as="section" className="bg-white py-bv-9 md:py-[120px]">
            <div className="container mx-auto max-w-bv-container px-bv-5">
              <header className="max-w-3xl">
                <SectionEyebrow number="05" label="Vozes de quem viajou" />
                <BicolorHeading as="h2" size="h1" className="mt-bv-3">
                  Quem <BicolorHighlight>buscou</BicolorHighlight> — e voltou pra
                  contar.
                </BicolorHeading>
                <p className="mt-bv-3 text-body-lg text-bv-navy/72 max-w-2xl">
                  Avaliações de viajantes verificados. Privacidade preservada —
                  só o primeiro nome.
                </p>
              </header>

              <div className="mt-bv-7 grid grid-cols-1 md:grid-cols-5 gap-bv-5">
                <div className="md:col-span-3">
                  <TestimonialCard
                    variant="big"
                    rating={testimonials[0].overall_rating}
                    comment={testimonials[0].comment ?? ''}
                    authorFirstName={testimonials[0].client.first_name}
                    authorLastInitial={testimonials[0].client.last_initial}
                    vehicleModel={testimonials[0].vehicle?.model}
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-bv-5">
                  {testimonials.slice(1, 3).map((t) => (
                    <TestimonialCard
                      key={t.id}
                      variant="compact"
                      rating={t.overall_rating}
                      comment={t.comment ?? ''}
                      authorFirstName={t.client.first_name}
                      authorLastInitial={t.client.last_initial}
                      vehicleModel={t.vehicle?.model}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* ════════════════════════════════════════════════════════════════
            06 — DÚVIDAS — FAQ
            ════════════════════════════════════════════════════════════════ */}
        <Reveal as="section" id="duvidas" className="bg-bv-bg py-bv-9 md:py-[120px]">
          <div className="container mx-auto max-w-bv-container px-bv-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-bv-7">
              <header className="lg:col-span-5 max-w-md">
                <SectionEyebrow number="06" label="Dúvidas" />
                <BicolorHeading as="h2" size="h1" className="mt-bv-3">
                  <BicolorHighlight>Perguntas</BicolorHighlight> mais frequentes.
                </BicolorHeading>
                <p className="mt-bv-3 text-body-lg text-bv-navy/72">
                  Pagamento, cancelamento, cobertura, taxas. Aqui tem o
                  essencial — sem letra miúda.
                </p>
                <p className="mt-bv-5 text-body-sm">
                  Não achou o que procura?{' '}
                  <a
                    href="mailto:contato@buscouviajou.demo"
                    className="text-bv-green font-semibold underline underline-offset-4 hover:text-bv-green-700"
                  >
                    Falar com a gente
                  </a>
                  .
                </p>
              </header>

              <div className="lg:col-span-7">
                <FaqAccordion items={FAQ_ITEMS} />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ════════════════════════════════════════════════════════════════
            B2B CALLOUT
            ════════════════════════════════════════════════════════════════ */}
        <Reveal as="div">
          <B2bCallout />
        </Reveal>

        {/* ════════════════════════════════════════════════════════════════
            CTA FECHAMENTO
            ════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="cta-final"
          className="relative bg-bv-navy text-white py-bv-9 md:py-[120px] overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            aria-hidden
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="container mx-auto max-w-bv-container px-bv-5 text-center max-w-3xl relative">
            <h2
              id="cta-final"
              className="font-heading font-black text-h1 md:text-display leading-tight tracking-tight"
            >
              <span className="text-white">Pronto pra </span>
              <span className="text-bv-green-300">primeira viagem?</span>
            </h2>
            <p className="mt-bv-4 text-body-lg text-white/80 max-w-xl mx-auto">
              Buscou Viajou: do mapa ao embarque, em poucos cliques.
            </p>
            <div className="mt-bv-7 flex flex-col items-center gap-bv-6">
              <Button asChild variant="accent" size="lg" iconLeft={<SearchIcon className="h-5 w-5" />}>
                <Link href="#main">Buscar viagens</Link>
              </Button>
              <JourneyTag size="md" inverse />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Texto plano das respostas pra serializar no JSON-LD do FAQPage.
 * Mantemos sincronizado com o JSX dos FAQ_ITEMS — espelho intencional.
 */
function faqAnswerText(id: string): string {
  switch (id) {
    case 'sobre':
      return 'Somos uma plataforma de tecnologia e comparação de preços. Nosso papel é reunir em um só lugar diversas empresas de turismo para que você possa comparar valores e serviços de forma rápida. Não somos uma empresa de transporte ou operadora de viagens, mas sim o facilitador da sua busca.';
    case 'responsabilidade':
      return 'Não. A responsabilidade integral pela execução do transporte, condições do veículo, cumprimento de horários, seguros e segurança dos passageiros é exclusiva da empresa de turismo que você escolher e contratar através do nosso comparador.';
    case 'reserva-pagamento':
      return 'O fechamento da reserva e o pagamento são realizados diretamente com a empresa de turismo escolhida. A Buscou Viajou apenas apresenta as opções de mercado. Certifique-se de conferir os termos de contrato da empresa antes de finalizar o pagamento.';
    case 'cancelamento-atraso':
      return 'Nesses casos, você deve entrar em contato diretamente com o suporte da empresa de turismo contratada. Como somos apenas um buscador, não temos gerência sobre a frota ou escala das empresas parceiras.';
    case 'preco-garantido':
      return 'Os preços e disponibilidades são atualizados em tempo real pelas próprias empresas parceiras através de nossa área do cliente. Caso haja qualquer divergência no momento da finalização, o valor válido será sempre o confirmado pela empresa prestadora do serviço.';
    case 'qualidade':
      return 'Monitoramos constantemente a satisfação dos usuários através de um sistema de avaliações. Empresas que não mantêm um padrão mínimo de qualidade ou recebem reclamações recorrentes são notificadas e podem ser excluídas da plataforma para garantir a sua segurança.';
    case 'privacidade-lgpd':
      return 'Sim. Operamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD). Seus dados de contato só serão compartilhados com a empresa de turismo caso você demonstre interesse em uma oferta específica, para viabilizar o seu atendimento.';
    case 'problema-empresa':
      return 'Recomendamos que tente resolver diretamente com o SAC da empresa. Caso não obtenha solução, você pode registrar uma avaliação na nossa plataforma para que nossa equipe de qualidade analise a conduta do parceiro.';
    default:
      return '';
  }
}
