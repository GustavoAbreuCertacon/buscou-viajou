import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CartographicTicks } from './cartographic-ticks';

/**
 * B2bCallout — faixa B2B navy entre as seções "Avaliações" e "FAQ".
 * Convida empresas com frota a anunciarem.
 * CTA leva pra /seja-parceiro (placeholder Fase 2).
 *
 * Visual: fundo navy, decoração cartográfica sutil canto sup direito,
 * heading bicolor invertida (white + green-300), CTA outline-on-navy.
 */
export function B2bCallout() {
  return (
    <section
      aria-labelledby="b2b-heading"
      className="relative isolate overflow-hidden bg-bv-navy text-white"
    >
      {/* Decoração cartográfica top-right */}
      <div
        className="absolute top-0 right-0 w-60 h-40 opacity-50 pointer-events-none"
        aria-hidden
      >
        <CartographicTicks position="top-right" className="text-white/16 w-full h-full" />
      </div>

      <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-7 md:py-bv-8 relative">
        <div className="flex flex-col md:flex-row md:items-center gap-bv-6 md:gap-bv-8">
          <div className="flex-1 max-w-2xl">
            <p className="text-caption font-bold uppercase tracking-[0.18em] text-bv-green-300">
              Para empresas
            </p>
            <h2
              id="b2b-heading"
              className="mt-bv-3 font-heading font-bold text-h2 md:text-h1 leading-tight"
            >
              <span className="text-white">Tem ônibus, vans ou micro-ônibus </span>
              <span className="text-bv-green-300">parados?</span>
            </h2>
            <p className="mt-bv-4 text-body-lg text-white/80">
              Anuncie sua frota no Buscou Viajou. Conecte-se a quem está
              buscando agora — sem mensalidade, paga só por reserva fechada.
            </p>
          </div>

          <div className="md:shrink-0">
            <Link
              href="/seja-parceiro"
              className="inline-flex items-center gap-bv-2 min-h-[56px] px-bv-7 py-bv-3 rounded-bv-md border-bv-base border-bv-green-300 bg-transparent text-bv-green-300 font-heading font-bold text-body-lg hover:bg-bv-green-300 hover:text-bv-navy transition-all duration-bv-base focus-visible:outline-none focus-visible:shadow-bv-focus"
            >
              Quero anunciar minha frota
              <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
