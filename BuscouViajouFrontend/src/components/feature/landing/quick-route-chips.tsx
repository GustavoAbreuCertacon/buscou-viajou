import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CURATED_ROUTES, buildSearchUrl } from './curated-routes';

/**
 * QuickRouteChips — atalho horizontal de rotas populares logo abaixo do
 * SearchForm no hero. Reduz fricção de digitação com um clique.
 *
 * Visual: linha de chips, scroll horizontal em mobile (sem scrollbar visível),
 * wrap no desktop. Cada chip é um Link real (com aria-label completo).
 */
export interface QuickRouteChipsProps {
  className?: string;
  /** Quantos exibir. Default 4. */
  limit?: number;
}

export function QuickRouteChips({ className, limit = 4 }: QuickRouteChipsProps) {
  const items = CURATED_ROUTES.slice(0, limit);

  return (
    <div className={cn('flex flex-col gap-bv-3', className)}>
      <p className="text-caption font-semibold uppercase tracking-[0.14em] text-bv-navy/60">
        Mais buscadas
      </p>
      <ul
        className="flex gap-bv-2 overflow-x-auto -mx-bv-3 px-bv-3 pb-bv-1 md:flex-wrap md:overflow-visible md:mx-0 md:px-0 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Rotas populares"
      >
        {items.map((route) => (
          <li key={route.shortLabel} className="shrink-0">
            <Link
              href={buildSearchUrl(route)}
              aria-label={`Buscar fretamento de ${route.origin.name} a ${route.destination.name}`}
              className={cn(
                'inline-flex items-center gap-bv-2 min-h-[44px] px-bv-4 py-bv-2',
                'rounded-bv-pill border border-bv-navy/12 bg-white',
                'text-body-sm font-semibold text-bv-navy',
                'transition-all duration-bv-base ease-bv-ease',
                'hover:bg-bv-navy hover:text-white hover:border-bv-navy',
                'focus-visible:outline-none focus-visible:shadow-bv-focus',
              )}
            >
              <span>{route.shortLabel}</span>
              <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
