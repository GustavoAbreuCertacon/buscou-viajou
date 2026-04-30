import { cn } from '@/lib/utils/cn';

/**
 * StatTrio — três números grandes em destaque editorial.
 * Cada stat: valor enorme em Gotham 900 (display) + label uppercase tracking.
 * Separadores verticais sutis (linha 1px) entre as três colunas no desktop.
 *
 * Usado como reforço da seção "Empresas" — manifesto de cobertura.
 */
export interface Stat {
  value: string;
  label: string;
  /** Caption opcional abaixo (1 linha) */
  caption?: string;
}

export interface StatTrioProps {
  stats: [Stat, Stat, Stat];
  inverse?: boolean;
  className?: string;
}

export function StatTrio({ stats, inverse, className }: StatTrioProps) {
  return (
    <dl
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-bv-6 md:gap-0',
        className,
      )}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={cn(
            'flex flex-col items-start text-left md:px-bv-6 first:md:pl-0 last:md:pr-0',
            i > 0 && 'md:border-l',
            i > 0 && (inverse ? 'md:border-white/16' : 'md:border-bv-navy/12'),
          )}
        >
          <dd
            className={cn(
              'font-heading font-black tabular-nums leading-none text-[64px] md:text-[80px]',
              inverse ? 'text-white' : 'text-bv-navy',
            )}
          >
            {stat.value}
          </dd>
          <dt
            className={cn(
              'mt-bv-3 font-heading font-bold text-body uppercase tracking-[0.14em]',
              inverse ? 'text-bv-green-300' : 'text-bv-green-700',
            )}
          >
            {stat.label}
          </dt>
          {stat.caption && (
            <p
              className={cn(
                'mt-bv-1 text-body-sm',
                inverse ? 'text-white/72' : 'text-bv-navy/72',
              )}
            >
              {stat.caption}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
}
