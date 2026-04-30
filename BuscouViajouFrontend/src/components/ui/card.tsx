import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Card — 5 variantes do DS.
 * design-dna.json → componentRules.cards + visualEffects.valueCardTriad
 */
const cardVariants = cva(
  ['rounded-bv-md transition-all duration-bv-base ease-bv-ease'],
  {
    variants: {
      variant: {
        default:    'bg-white border border-bv-navy/12 shadow-bv-md',
        outline:    'bg-white border-bv-base border-bv-green',
        accent:     'bg-bv-green text-white',
        brand:      'bg-bv-navy text-white',
        interactive:'bg-white border border-bv-navy/12 shadow-bv-md hover:shadow-bv-lg hover:border-bv-navy/24 cursor-pointer focus-visible:outline-none focus-visible:shadow-bv-focus',
      },
      padding: {
        none: 'p-0',
        sm:   'p-bv-4',
        md:   'p-bv-5',
        lg:   'p-bv-6',
      },
      rotate: {
        none: '',
        left: '-rotate-2',
        leftStrong: '-rotate-[4deg]',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      rotate: 'none',
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, rotate, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, rotate }), className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-bv-2', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-heading font-bold text-h3 leading-snug', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-body text-bv-navy/72', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-bv-4', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-bv-5 flex items-center gap-bv-3', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { cardVariants };
