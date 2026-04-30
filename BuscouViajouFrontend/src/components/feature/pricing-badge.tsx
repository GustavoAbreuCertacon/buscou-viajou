import { TrendingDown, TrendingUp, AlertTriangle, Flame, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

/**
 * PricingBadge — indicador visual de pricing dinâmico (PRD §6.10 + design-dna).
 *
 * Indicators do backend (vide quotes.dto.ts):
 *  PROMO     → 0.8x-0.95x (oferta > demanda)
 *  NORMAL    → 1.0x default
 *  HIGH      → 1.1x-1.3x (alta procura)
 *  VERY_HIGH → 1.3x-1.6x
 *  PEAK      → 1.6x-2.0x (pico)
 */
export type PricingIndicator = 'PROMO' | 'NORMAL' | 'HIGH' | 'VERY_HIGH' | 'PEAK';

interface Props {
  indicator: PricingIndicator;
  /** Override do label (default vem da regra). */
  label?: string;
  /** Multiplicador pra mostrar percentual (ex: 1.2 → "+20%"). Opcional. */
  multiplier?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CONFIG: Record<
  PricingIndicator,
  { label: string; variant: Parameters<typeof Badge>[0]['variant']; Icon: typeof TrendingDown }
> = {
  PROMO:     { label: 'Melhor preço',       variant: 'solidGreen', Icon: TrendingDown },
  NORMAL:    { label: 'Preço normal',       variant: 'neutral',    Icon: Minus },
  HIGH:      { label: 'Alta procura',       variant: 'warning',    Icon: TrendingUp },
  VERY_HIGH: { label: 'Procura muito alta', variant: 'warning',    Icon: AlertTriangle },
  PEAK:      { label: 'Preço de pico',      variant: 'danger',     Icon: Flame },
};

export function PricingBadge({ indicator, label, multiplier, size = 'md', className }: Props) {
  const cfg = CONFIG[indicator];
  const { Icon } = cfg;
  const finalLabel = label ?? cfg.label;
  const showPct = multiplier !== undefined && Math.abs(multiplier - 1) > 0.01;
  const pct = showPct ? `${multiplier > 1 ? '+' : ''}${Math.round((multiplier - 1) * 100)}%` : null;

  const iconSize = size === 'sm' ? 11 : size === 'lg' ? 16 : 13;

  return (
    <Badge
      variant={cfg.variant}
      size={size}
      className={cn('gap-1', className)}
      iconLeft={<Icon size={iconSize} strokeWidth={2.5} />}
    >
      {finalLabel}
      {pct && <span className="ml-0.5 font-bold tabular-nums">{pct}</span>}
    </Badge>
  );
}
