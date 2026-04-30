import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUp, Printer } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading, BicolorHighlight } from '@/components/ui/bicolor-heading';
import { Button } from '@/components/ui/button';
import { SectionEyebrow } from '@/components/feature/landing/section-eyebrow';
import { CartographicTicks } from '@/components/feature/landing/cartographic-ticks';
import { getCurrentUser } from '@/lib/auth/get-current-user';

export const metadata: Metadata = {
  title: 'Termos de Uso e Política de Privacidade — Buscou Viajou',
  description:
    'Termos de Uso e Política de Privacidade da Buscou Viajou. Plataforma de intermediação digital e comparação de preços de fretamento turístico no Brasil. LGPD em conformidade.',
  alternates: { canonical: '/termos' },
};

const LAST_UPDATED = '30 de abril de 2026';

interface TermsSection {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: TermsSection[] = [
  { id: 'fazemos', number: '01', title: 'O que nós fazemos' },
  { id: 'nao-fazemos', number: '02', title: 'O que nós NÃO fazemos' },
  { id: 'dados', number: '03', title: 'Seus dados (LGPD)' },
  { id: 'avaliacoes', number: '04', title: 'Avaliações' },
  { id: 'cancelamentos', number: '05', title: 'Cancelamentos' },
];

export default async function TermosPage() {
  const user = await getCurrentUser();
  const userMeta = user ? { firstName: user.firstName } : null;

  return (
    <>
      <Navbar user={userMeta} />

      <main id="main">
        {/* Hero */}
        <section className="bv-canvas relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[280px] h-[180px] pointer-events-none hidden md:block"
            aria-hidden
          >
            <CartographicTicks position="top-right" className="w-full h-full" />
          </div>

          <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-9 md:py-[120px] relative">
            <div className="max-w-3xl">
              <SectionEyebrow number="LEGAL" label="Aviso e condições" />
              <BicolorHeading as="h1" size="display" className="mt-bv-3">
                <BicolorHighlight>Termos de Uso</BicolorHighlight> e Política de
                Privacidade.
              </BicolorHeading>
              <p className="mt-bv-5 text-body-lg text-bv-navy/72 leading-relaxed">
                Bem-vindo à Buscou Viajou. Ao utilizar nossa plataforma, você
                concorda com as condições abaixo.
              </p>
              <p className="mt-bv-4 inline-flex items-center gap-bv-2 text-caption font-bold uppercase tracking-[0.14em] text-bv-navy/72">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-bv-pill bg-bv-green"
                />
                Última atualização: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </section>

        {/* Conteúdo + TOC */}
        <section className="bg-white py-bv-9 md:py-[120px]">
          <div className="container mx-auto max-w-bv-container px-bv-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-bv-7 lg:gap-bv-8">
              {/* TOC */}
              <aside className="lg:col-span-4 xl:col-span-3" aria-label="Sumário">
                <div className="lg:sticky lg:top-24">
                  <nav className="rounded-bv-md border border-bv-navy/12 bg-white p-bv-5">
                    <p className="text-caption font-bold uppercase tracking-[0.18em] text-bv-navy/60">
                      Nesta página
                    </p>
                    <ol className="mt-bv-3 flex flex-col gap-bv-2">
                      {SECTIONS.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`#${s.id}`}
                            className="group flex items-baseline gap-bv-3 py-bv-1 text-body-sm text-bv-navy/72 hover:text-bv-green focus-visible:outline-none focus-visible:rounded-bv-sm focus-visible:shadow-bv-focus transition-colors duration-bv-fast"
                          >
                            <span className="font-heading font-bold tabular-nums text-bv-navy/40 group-hover:text-bv-green text-caption">
                              {s.number}
                            </span>
                            <span className="font-medium">{s.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </nav>

                  <div className="mt-bv-4 hidden lg:block">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconLeft={<Printer className="h-4 w-4" />}
                      asChild
                    >
                      <a
                        href="javascript:window.print()"
                        // eslint-disable-next-line react/no-unknown-property
                        // (apenas pra interação local)
                      >
                        Imprimir
                      </a>
                    </Button>
                  </div>
                </div>
              </aside>

              {/* Conteúdo */}
              <article className="lg:col-span-8 xl:col-span-9 max-w-3xl">
                <Section id="fazemos" number="01" title="O que nós fazemos">
                  <p>
                    A Buscou Viajou é um{' '}
                    <strong className="text-bv-navy">
                      buscador e comparador de preços de serviços de turismo
                    </strong>
                    . Nosso objetivo é facilitar sua busca, conectando você
                    diretamente com as melhores ofertas de empresas cadastradas.
                  </p>
                </Section>

                <Section
                  id="nao-fazemos"
                  number="02"
                  title="O que nós NÃO fazemos (limitação de responsabilidade)"
                >
                  <ul className="space-y-bv-4">
                    <li>
                      <strong className="text-bv-navy">
                        A execução do serviço:
                      </strong>{' '}
                      não somos transportadora nem operadora de turismo. Toda a
                      responsabilidade pela viagem, veículos, seguros, horários
                      e segurança é exclusiva da empresa escolhida por você.
                    </li>
                    <li>
                      <strong className="text-bv-navy">
                        Pagamentos e reservas:
                      </strong>{' '}
                      caso você finalize uma compra, a transação ocorre
                      diretamente com a empresa parceira. Não nos
                      responsabilizamos por falhas na prestação do serviço de
                      terceiros.
                    </li>
                    <li>
                      <strong className="text-bv-navy">
                        Preços e disponibilidade:
                      </strong>{' '}
                      os preços são atualizados pelas próprias empresas
                      parceiras. Em caso de divergência, prevalece o valor
                      final informado pela empresa no ato da reserva.
                    </li>
                  </ul>
                </Section>

                <Section id="dados" number="03" title="Seus dados (LGPD)">
                  <p>
                    Para que você possa comparar preços e receber ofertas,
                    coletamos alguns dados básicos.
                  </p>
                  <ul className="mt-bv-4 space-y-bv-4">
                    <li>
                      <strong className="text-bv-navy">Finalidade:</strong>{' '}
                      usamos seus dados apenas para processar suas buscas e
                      viabilizar o contato com a empresa de turismo.
                    </li>
                    <li>
                      <strong className="text-bv-navy">Segurança:</strong>{' '}
                      suas informações são tratadas com sigilo e conforme a
                      Lei Geral de Proteção de Dados (Lei 13.709/2018).
                    </li>
                    <li>
                      <strong className="text-bv-navy">Compartilhamento:</strong>{' '}
                      seus dados de contato só serão compartilhados com a
                      empresa parceira se você solicitar um orçamento ou
                      reserva.
                    </li>
                  </ul>
                </Section>

                <Section id="avaliacoes" number="04" title="Avaliações">
                  <p>
                    Ao usar a plataforma, você poderá avaliar os serviços das
                    empresas parceiras. Suas avaliações devem ser{' '}
                    <strong className="text-bv-navy">
                      verídicas e respeitosas
                    </strong>
                    . Reservamo-nos o direito de remover conteúdos ofensivos.
                  </p>
                </Section>

                <Section id="cancelamentos" number="05" title="Cancelamentos">
                  <p>
                    Eventuais pedidos de cancelamento ou reembolso devem ser
                    tratados{' '}
                    <strong className="text-bv-navy">
                      diretamente com a empresa de turismo contratada
                    </strong>
                    , seguindo a política de cancelamento própria dela e o
                    Código de Defesa do Consumidor.
                  </p>
                </Section>

                {/* Aceite simbólico + back to top */}
                <div className="mt-bv-9 pt-bv-7 border-t border-bv-navy/12 flex flex-col gap-bv-4">
                  <p className="text-body-sm text-bv-navy/72">
                    Em caso de dúvidas sobre estes Termos, escreva pra{' '}
                    <a
                      href="mailto:contato@buscouviajou.demo"
                      className="text-bv-green font-semibold underline underline-offset-4 hover:text-bv-green-700"
                    >
                      contato@buscouviajou.demo
                    </a>
                    .
                  </p>
                  <div className="flex flex-wrap gap-bv-3">
                    <Button asChild variant="accent" size="md" iconLeft={<ArrowUp className="h-4 w-4" />}>
                      <a href="#main">Voltar ao topo</a>
                    </Button>
                    <Button asChild variant="ghost" size="md">
                      <Link href="/">Ir pra home</Link>
                    </Button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

interface SectionWrapProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, number, title, children }: SectionWrapProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 py-bv-7 first:pt-0 border-b last:border-b-0 border-bv-navy/12"
    >
      <header className="mb-bv-5 flex items-baseline gap-bv-3">
        <span
          aria-hidden
          className="font-heading font-black tabular-nums text-bv-green text-h4 leading-none shrink-0"
        >
          {number}
        </span>
        <h2
          id={`${id}-heading`}
          className="font-heading font-bold text-h2 text-bv-navy leading-snug"
        >
          {title}
        </h2>
      </header>
      <div className="text-body text-bv-navy/80 leading-relaxed [&_strong]:text-bv-navy [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-bv-5">
        {children}
      </div>
    </section>
  );
}
