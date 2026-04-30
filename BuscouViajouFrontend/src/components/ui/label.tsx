import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils/cn';

/**
 * Label — sempre acima do input. Direta e curta, com voz da marca.
 * design-dna.json → componentRules.inputs.label
 *
 * Voz: "Para onde?" / "Quando?" / "Quantos passageiros?"
 * NÃO: "Insira o destino" / "Digite a data"
 */
export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-body-sm font-semibold text-bv-navy leading-snug',
      'peer-disabled:opacity-40 peer-disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  >
    {children}
    {required && <span className="text-bv-danger ml-0.5" aria-hidden>*</span>}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;
