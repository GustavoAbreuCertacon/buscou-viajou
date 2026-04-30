import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * TestimonialCard — depoimento real (privacy-first: só primeiro nome + inicial).
 *
 * Variante 'big': pull quote tipográfica grande, com frame-corner brackets navy
 * sugerindo "moldura editorial". Usado pra 1 depoimento de destaque.
 *
 * Variante 'compact': card menor, layout horizontal — usado pra 2-3
 * depoimentos secundários ao lado/abaixo do big.
 *
 * design-dna.json → visualEffects.frameCorner (>200px each side) +
 * componentRules.cards
 */
export interface TestimonialCardProps {
  rating: number;
  comment: string;
  authorFirstName: string;
  authorLastInitial?: string | null;
  vehicleModel?: string | null;
  /** Localização opcional, ex: "São Paulo, SP" */
  location?: string;
  variant?: 'big' | 'compact';
  className?: string;
}

export function TestimonialCard({
  rating,
  comment,
  authorFirstName,
  authorLastInitial,
  vehicleModel,
  location,
  variant = 'compact',
  className,
}: TestimonialCardProps) {
  const displayName = `${authorFirstName}${authorLastInitial ? ` ${authorLastInitial}.` : ''}`;
  const isBig = variant === 'big';

  return (
    <article
      className={cn(
        'relative flex flex-col rounded-bv-lg bg-white',
        isBig
          ? 'bv-frame-corner border border-bv-navy/8 p-bv-7 md:p-bv-8'
          : 'border border-bv-navy/12 p-bv-5',
        className,
      )}
    >
      {/* Aspas decorativas no big — Gotham black 900 muito grande */}
      {isBig && (
        <span
          aria-hidden
          className="absolute -top-3 left-bv-5 font-heading font-black text-bv-green/24 text-[120px] leading-none select-none"
        >
          “
        </span>
      )}

      {/* Stars */}
      <div className="flex items-center gap-bv-1" aria-label={`${rating} de 5 estrelas`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={isBig ? 18 : 14}
            strokeWidth={1.5}
            className={cn(
              n <= rating
                ? 'fill-bv-green text-bv-green'
                : 'fill-bv-navy/8 text-bv-navy/16',
            )}
            aria-hidden
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote
        className={cn(
          'mt-bv-4 text-bv-navy leading-relaxed',
          isBig
            ? 'font-heading font-medium text-h3 md:text-h2 leading-snug'
            : 'text-body',
        )}
      >
        {comment}
      </blockquote>

      {/* Author */}
      <footer
        className={cn(
          'mt-bv-5 pt-bv-4 border-t flex items-center justify-between gap-bv-3',
          isBig ? 'border-bv-navy/12' : 'border-bv-navy/8',
        )}
      >
        <div className="flex items-center gap-bv-3">
          <span
            aria-hidden
            className={cn(
              'rounded-bv-pill bg-bv-navy text-white flex items-center justify-center font-heading font-bold uppercase shrink-0',
              isBig ? 'h-12 w-12 text-h4' : 'h-10 w-10 text-body-sm',
            )}
          >
            {authorFirstName[0]}
          </span>
          <div className="flex flex-col">
            <p
              className={cn(
                'font-semibold text-bv-navy',
                isBig ? 'text-body-lg' : 'text-body',
              )}
            >
              {displayName}
            </p>
            {(location || vehicleModel) && (
              <p className="text-caption text-bv-navy/72">
                {[location, vehicleModel].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-bv-2 py-0.5 rounded-bv-pill bg-bv-green-50 text-bv-green-700 text-caption font-bold uppercase tracking-wider',
          )}
        >
          Verificado
        </span>
      </footer>
    </article>
  );
}
