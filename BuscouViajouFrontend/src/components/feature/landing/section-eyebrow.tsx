import { cn } from '@/lib/utils/cn';

/**
 * SectionEyebrow — micro-rótulo numerado editorial no topo de cada seção.
 * Estilo "01 — DESTINOS" tipo magazine layout.
 *
 * Visual: Gotham bold 700, uppercase, tracking-wider, navy-700 sobre claro,
 * white sobre navy. Linha sutil divisória depois do número.
 */
export interface SectionEyebrowProps {
  number: string;
  label: string;
  inverse?: boolean;
  className?: string;
}

export function SectionEyebrow({ number, label, inverse, className }: SectionEyebrowProps) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-bv-3 font-heading font-bold text-caption uppercase tracking-[0.18em]',
        inverse ? 'text-white/70' : 'text-bv-navy-700',
        className,
      )}
    >
      <span className={cn('tabular-nums', inverse ? 'text-bv-green-300' : 'text-bv-green')}>
        {number}
      </span>
      <span
        aria-hidden
        className={cn('h-px w-8', inverse ? 'bg-white/30' : 'bg-bv-navy/24')}
      />
      <span>{label}</span>
    </p>
  );
}
