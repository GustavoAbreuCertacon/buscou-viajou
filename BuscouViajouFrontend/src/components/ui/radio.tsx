'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils/cn';

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('grid gap-bv-3', className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-5 w-5 rounded-full border border-bv-navy/24 bg-white',
      'transition-all duration-bv-base ease-bv-ease',
      'focus-visible:outline-none focus-visible:shadow-bv-focus',
      'data-[state=checked]:border-bv-green data-[state=checked]:border-[6px]',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center" />
  </RadioGroupPrimitive.Item>
));
RadioItem.displayName = RadioGroupPrimitive.Item.displayName;
