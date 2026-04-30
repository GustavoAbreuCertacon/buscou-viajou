import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Buscou → Encontrou → Viajou
 * Assinatura de jornada da marca. Use com moderação — é signature, não pattern.
 *
 * design-dna.json → visualEffects.journeyTag
 */

export interface JourneyTagProps {
  size?: 'sm' | 'md' | 'lg';
  inverse?: boolean; // pra usar sobre fundo escuro (navy/green)
  className?: string;
}

const SIZE_CLASS = {
  sm: 'text-body-sm gap-2',
  md: 'text-body-lg gap-3',
  lg: 'text-h3 gap-4',
};

const ICON_SIZE = { sm: 14, md: 18, lg: 24 };

export function JourneyTag({ size = 'md', inverse = false, className }: JourneyTagProps) {
  return (
    <ol
      className={cn(
        'inline-flex items-center font-heading font-bold',
        inverse ? 'text-white' : 'text-bv-green',
        SIZE_CLASS[size],
        className,
      )}
      aria-label="Buscou, encontrou, viajou"
    >
      <li>Buscou</li>
      <li aria-hidden className="flex items-center">
        <ArrowRight size={ICON_SIZE[size]} strokeWidth={2.5} />
      </li>
      <li>Encontrou</li>
      <li aria-hidden className="flex items-center">
        <ArrowRight size={ICON_SIZE[size]} strokeWidth={2.5} />
      </li>
      <li>Viajou</li>
    </ol>
  );
}
