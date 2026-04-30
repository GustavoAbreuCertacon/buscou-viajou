import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { CuratedRoute } from './curated-routes';
import { buildSearchUrl } from './curated-routes';

/**
 * RouteCard — card de rota popular pra seção "01 — DESTINOS".
 * Visual editorial: tagline pequena + origem/destino em hierarquia tipográfica
 * + linha vertical sutil "rota traçada" + métricas inline + CTA "Comparar".
 *
 * Card inteiro é clicável (cobre o card via overlay link). Métricas e título
 * stat lado-a-lado mostram densidade de oferta.
 */
export interface RouteCardProps {
  route: CuratedRoute;
  /** Quantidade de empresas atendendo a rota — derivado server-side. Opcional. */
  companiesCount?: number;
  className?: string;
}

export function RouteCard({ route, companiesCount, className }: RouteCardProps) {
  const href = buildSearchUrl(route);
  const ariaLabel = `Comparar fretamentos de ${route.origin.name} a ${route.destination.name}`;

  return (
    <article
      className={cn(
        'group relative isolate flex flex-col rounded-bv-md bg-white border border-bv-navy/12',
        'p-bv-5 transition-all duration-bv-base ease-bv-ease',
        'hover:shadow-bv-lg hover:border-bv-navy/24',
        'focus-within:shadow-bv-lg focus-within:border-bv-green',
        className,
      )}
    >
      {/* Tagline editorial */}
      <p className="text-caption font-bold uppercase tracking-[0.14em] text-bv-green-700">
        {route.tagline}
      </p>

      {/* Origem / linha-de-rota / destino */}
      <div className="mt-bv-4 flex gap-bv-3">
        {/* Marcador visual: dot navy → linha tracejada → dot green */}
        <div
          aria-hidden
          className="flex flex-col items-center pt-2"
        >
          <span className="h-2.5 w-2.5 rounded-bv-pill border-bv-base border-bv-navy bg-white" />
          <span className="my-1 h-12 w-px border-l border-dashed border-bv-navy/32" />
          <span className="h-2.5 w-2.5 rounded-bv-pill bg-bv-green" />
        </div>

        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <p className="text-caption uppercase tracking-wider text-bv-navy/60 font-semibold">
              de
            </p>
            <p className="font-heading font-bold text-h3 text-bv-navy leading-tight truncate">
              {route.origin.name}
              <span className="text-bv-navy/60 font-medium text-body-lg">
                , {route.origin.state}
              </span>
            </p>
          </div>
          <div className="mt-bv-3">
            <p className="text-caption uppercase tracking-wider text-bv-navy/60 font-semibold">
              para
            </p>
            <p className="font-heading font-bold text-h3 leading-tight truncate">
              <span className="text-bv-green">{route.destination.name}</span>
              <span className="text-bv-navy/60 font-medium text-body-lg">
                , {route.destination.state}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Métricas inline */}
      <dl className="mt-bv-5 flex items-center gap-bv-5 text-body-sm">
        <div className="flex flex-col">
          <dt className="text-caption uppercase tracking-wider text-bv-navy/60 font-semibold">
            distância
          </dt>
          <dd className="font-heading font-bold text-bv-navy tabular-nums">
            {route.distanceKm} km
          </dd>
        </div>
        <div className="h-8 w-px bg-bv-navy/8" aria-hidden />
        <div className="flex flex-col">
          <dt className="text-caption uppercase tracking-wider text-bv-navy/60 font-semibold">
            duração
          </dt>
          <dd className="font-heading font-bold text-bv-navy tabular-nums">
            ~{route.durationHours}h
          </dd>
        </div>
        {typeof companiesCount === 'number' && companiesCount > 0 && (
          <>
            <div className="h-8 w-px bg-bv-navy/8" aria-hidden />
            <div className="flex flex-col">
              <dt className="text-caption uppercase tracking-wider text-bv-navy/60 font-semibold">
                empresas
              </dt>
              <dd className="font-heading font-bold text-bv-navy tabular-nums">
                {companiesCount}
              </dd>
            </div>
          </>
        )}
      </dl>

      {/* CTA inline (overlay link) */}
      <div className="mt-bv-5 pt-bv-4 border-t border-bv-navy/8 flex items-center justify-between">
        <span className="text-body-sm text-bv-navy/72">
          Cotação em segundos
        </span>
        <span
          className="inline-flex items-center gap-bv-1 font-heading font-bold text-body text-bv-green group-hover:gap-bv-2 transition-all duration-bv-base"
          aria-hidden
        >
          Comparar
          <ArrowRight size={16} strokeWidth={2.5} />
        </span>
      </div>

      <Link
        href={href}
        aria-label={ariaLabel}
        className="absolute inset-0 z-10 rounded-bv-md focus-visible:outline-none focus-visible:shadow-bv-focus"
      >
        <span className="sr-only">{ariaLabel}</span>
      </Link>
    </article>
  );
}
