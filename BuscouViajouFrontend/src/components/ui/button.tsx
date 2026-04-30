import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Button — 5 variantes do Design System Buscou Viajou
 * Ver design-dna.json → componentRules.buttons
 *
 * Padrões inegociáveis:
 *  - focus ring SEMPRE verde (shadow-bv-focus)
 *  - min-height 44px (touch a11y)
 *  - padding 12×24px default (px-6 py-3)
 *  - radius 8px (rounded-bv-md)
 *  - font-weight 600
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-body font-semibold',
    'rounded-bv-md',
    'transition-all duration-bv-base ease-bv-ease',
    'focus-visible:outline-none focus-visible:shadow-bv-focus',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-bv-navy text-white hover:bg-bv-navy-600 active:bg-bv-navy-700',
        accent:  'bg-bv-green text-white hover:bg-bv-green-600 active:bg-bv-green-700',
        outline: 'bg-transparent text-bv-navy border-bv-base border-bv-navy hover:bg-bv-navy hover:text-white',
        ghost:   'bg-transparent text-bv-navy-700 hover:bg-bv-navy-50 active:bg-bv-navy-100',
        danger:  'bg-bv-danger text-white hover:bg-[#b53a3a] active:bg-[#9d2f2f]',
        link:    'bg-transparent text-bv-green underline underline-offset-4 hover:text-bv-green-700 px-0 py-0 min-h-0',
      },
      size: {
        sm:  'h-9  px-4 text-body-sm',
        md:  'h-11 px-6 text-body min-h-[44px]',
        lg:  'h-14 px-8 text-body-lg',
        icon:'h-11 w-11 min-h-[44px] min-w-[44px] p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      iconLeft,
      iconRight,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    // Quando asChild=true, o Slot exige um único filho (sem Fragment com múltiplos
    // elementos), então passamos children direto. Loading/icons só são aplicados
    // no modo nativo (asChild=false).
    const content = asChild ? (
      children
    ) : loading ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        <span>{loadingText ?? children}</span>
      </>
    ) : (
      <>
        {iconLeft}
        {children}
        {iconRight}
      </>
    );

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
