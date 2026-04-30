import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Skeleton — bloco placeholder com shimmer.
 * Sempre dimensione pra combinar com o conteúdo final.
 * Honra prefers-reduced-motion automaticamente.
 *
 * design-dna.json → componentRules.skeleton + visualEffects.skeletonPattern
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forma. 'rect' = retângulo arredondado (default). 'circle' = círculo.
   * 'text' = altura de 1 linha de texto.
   */
  shape?: 'rect' | 'circle' | 'text';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape = 'rect', ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'bv-skeleton bg-bv-navy-50 overflow-hidden relative',
        shape === 'circle' && 'rounded-full',
        shape === 'rect' && 'rounded-bv-md',
        shape === 'text' && 'h-4 rounded-bv-sm',
        className,
      )}
      {...props}
    />
  ),
);

Skeleton.displayName = 'Skeleton';
