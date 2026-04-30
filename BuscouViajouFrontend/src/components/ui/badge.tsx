import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Badge / Chip — pílulas pequenas pra tags, status, indicadores.
 * design-dna.json → componentRules.chipBadge
 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1',
    'font-body font-semibold',
    'rounded-bv-pill',
    'leading-tight whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        neutral:    'bg-bv-navy-50 text-bv-navy-700',
        accent:     'bg-bv-green-50 text-bv-green-700',
        solidNavy:  'bg-bv-navy text-white',
        solidGreen: 'bg-bv-green text-white',
        warning:    'bg-[#FFF4E0] text-[#A06D1F]',
        danger:     'bg-[#FCE8E8] text-[#9C2C2C]',
        outlineNavy:'bg-transparent text-bv-navy border border-bv-navy/24',
        outlineGreen:'bg-transparent text-bv-green-700 border border-bv-green/40',
      },
      size: {
        sm: 'text-[11px] px-2 py-0.5',
        md: 'text-caption px-3 py-1',
        lg: 'text-body-sm px-4 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  iconLeft?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, iconLeft, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {iconLeft}
      {children}
    </span>
  ),
);

Badge.displayName = 'Badge';

export { badgeVariants };
