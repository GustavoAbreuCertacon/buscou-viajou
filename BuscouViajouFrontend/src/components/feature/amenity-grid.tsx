import { getAmenityIcon } from '@/lib/utils/amenity-icons';
import { cn } from '@/lib/utils/cn';

interface Amenity {
  id?: string;
  name: string;
  icon?: string | null;
}

interface Props {
  amenities: Amenity[];
  /** Modo compacto (inline) ou grid completo */
  variant?: 'inline' | 'grid';
  /** Limite de items no modo inline (mostra "+N" se exceder) */
  inlineLimit?: number;
  className?: string;
}

/**
 * AmenityGrid — grid ou inline de comodidades do veículo.
 *
 * - inline: 4-5 ícones com tooltip + "+N mais" se excede
 * - grid: lista completa com ícone + nome (na tela de detalhes)
 */
export function AmenityGrid({ amenities, variant = 'grid', inlineLimit = 5, className }: Props) {
  if (!amenities.length) {
    return (
      <p className={cn('text-body-sm text-bv-navy/72 italic', className)}>
        Sem comodidades cadastradas.
      </p>
    );
  }

  if (variant === 'inline') {
    const visible = amenities.slice(0, inlineLimit);
    const overflow = amenities.length - visible.length;
    return (
      <ul className={cn('flex items-center gap-bv-3 flex-wrap', className)}>
        {visible.map((a, i) => {
          const Icon = getAmenityIcon(a.name);
          return (
            <li
              key={a.id ?? `${a.name}-${i}`}
              className="inline-flex items-center gap-1 text-body-sm text-bv-navy-700"
              title={a.name}
            >
              <Icon size={16} className="text-bv-navy/72" strokeWidth={2} aria-hidden />
              <span className="hidden sm:inline">{a.name}</span>
            </li>
          );
        })}
        {overflow > 0 && (
          <li className="text-body-sm font-medium text-bv-navy/72 tabular-nums">
            +{overflow} mais
          </li>
        )}
      </ul>
    );
  }

  return (
    <ul className={cn('grid grid-cols-2 md:grid-cols-3 gap-bv-4', className)}>
      {amenities.map((a, i) => {
        const Icon = getAmenityIcon(a.name);
        return (
          <li
            key={a.id ?? `${a.name}-${i}`}
            className="flex items-center gap-bv-3 text-body text-bv-navy"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-bv-md bg-bv-green-50 text-bv-green-700">
              <Icon size={20} strokeWidth={2} aria-hidden />
            </span>
            <span className="font-medium">{a.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
