import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Company } from '@/lib/api/types';

/**
 * CompanyStrip — directório editorial das empresas parceiras.
 * Estilo "press list" / index, numerado, denso mas legível.
 *
 * 4 cols desktop · 2 cols tablet · 1 col mobile.
 * Cada tile: número grande em Gotham, nome da empresa, rating + count,
 * regiões operadas como chips minimalistas.
 *
 * Server-component friendly. Recebe lista já fetchada.
 */
export interface CompanyStripProps {
  companies: Company[];
  className?: string;
}

export function CompanyStrip({ companies, className }: CompanyStripProps) {
  return (
    <ol
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-bv-4',
        className,
      )}
      aria-label="Empresas parceiras"
    >
      {companies.map((company, idx) => (
        <li
          key={company.id}
          className="group relative flex flex-col rounded-bv-md bg-white border border-bv-navy/12 p-bv-5 transition-all duration-bv-base hover:shadow-bv-md hover:border-bv-navy/24"
        >
          {/* Número editorial (canto sup esq) */}
          <span
            aria-hidden
            className="font-heading font-black text-bv-navy/24 text-h4 tabular-nums leading-none"
          >
            {String(idx + 1).padStart(2, '0')}
          </span>

          {/* Nome da empresa */}
          <h3 className="mt-bv-3 font-heading font-bold text-h4 leading-snug text-bv-navy">
            {company.name}
          </h3>

          {/* Rating + reviews */}
          <p className="mt-bv-2 inline-flex items-center gap-bv-1 text-body-sm text-bv-navy/72">
            <Star
              size={14}
              strokeWidth={2}
              className="fill-bv-green text-bv-green"
              aria-hidden
            />
            <span className="font-bold text-bv-navy tabular-nums">
              {company.average_rating.toFixed(1)}
            </span>
            <span className="text-bv-navy/72 tabular-nums">
              ({company.total_reviews})
            </span>
          </p>

          {/* Regiões operadas */}
          <ul className="mt-bv-3 flex flex-wrap gap-bv-1" aria-label="Estados atendidos">
            {company.operating_regions.map((region) => (
              <li
                key={region}
                className="inline-flex items-center px-bv-2 py-0.5 rounded-bv-pill bg-bv-navy-50 text-bv-navy-700 text-caption font-semibold tabular-nums"
              >
                {region}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
