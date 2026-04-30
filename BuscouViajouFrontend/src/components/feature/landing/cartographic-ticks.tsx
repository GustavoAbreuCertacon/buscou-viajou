import { cn } from '@/lib/utils/cn';

/**
 * CartographicTicks — decoração SVG do hero.
 * Pequenas marcas de latitude/longitude evocando atlas / mapa náutico,
 * sem ler como ilustração. Reforça o territory "Editorial Cartography".
 *
 * Uso: posicionar absolute em corners do hero, atrás do conteúdo
 * (z-0 + pointer-events-none).
 *
 * design-dna.json → designStyle.philosophy ("Blueprint Planner")
 */
export interface CartographicTicksProps {
  position?: 'top-right' | 'bottom-left';
  className?: string;
}

export function CartographicTicks({ position = 'top-right', className }: CartographicTicksProps) {
  if (position === 'top-right') {
    return (
      <svg
        viewBox="0 0 240 160"
        className={cn('text-bv-navy/16 pointer-events-none select-none', className)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden
        role="presentation"
      >
        {/* Coordenadas decorativas em linha tracejada */}
        <line x1="0" y1="20" x2="240" y2="20" strokeDasharray="2 6" />
        <line x1="0" y1="60" x2="240" y2="60" strokeDasharray="2 6" />
        <line x1="200" y1="0" x2="200" y2="160" strokeDasharray="2 6" />

        {/* Ticks pequenos */}
        {[40, 80, 120, 160].map((x) => (
          <line key={x} x1={x} y1="18" x2={x} y2="22" strokeDasharray="0" />
        ))}

        {/* Ponto cardeal sutil canto sup direito */}
        <circle cx="200" cy="20" r="3" fill="currentColor" stroke="none" />

        {/* Etiqueta cartográfica em monoSpace-ish (Gotham 500) */}
        <text
          x="208"
          y="14"
          fontSize="8"
          fontFamily="Gotham, sans-serif"
          fontWeight="500"
          fill="currentColor"
          letterSpacing="1"
        >
          23°S 46°W
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 120"
      className={cn('text-bv-navy/16 pointer-events-none select-none', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
      role="presentation"
    >
      <line x1="0" y1="100" x2="200" y2="100" strokeDasharray="2 6" />
      <line x1="20" y1="0" x2="20" y2="120" strokeDasharray="2 6" />
      {[40, 80, 120, 160].map((x) => (
        <line key={x} x1={x} y1="98" x2={x} y2="102" strokeDasharray="0" />
      ))}
      <circle cx="20" cy="100" r="3" fill="currentColor" stroke="none" />
      <text
        x="28"
        y="116"
        fontSize="8"
        fontFamily="Gotham, sans-serif"
        fontWeight="500"
        fill="currentColor"
        letterSpacing="1"
      >
        ROTAS · BR
      </text>
    </svg>
  );
}
