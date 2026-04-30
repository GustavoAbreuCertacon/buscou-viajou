'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Sheet — drawer lateral baseado em Radix Dialog.
 * Usado pra: filtros mobile (bottom), edit busca (right), menu mobile (right).
 */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-bv-navy/60 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sheetVariants = cva(
  [
    'fixed z-50 bg-white shadow-bv-lg flex flex-col',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:duration-300 data-[state=open]:duration-300',
  ],
  {
    variants: {
      side: {
        top:    'inset-x-0 top-0 border-b border-bv-navy/12 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom: 'inset-x-0 bottom-0 rounded-t-bv-lg data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left:   'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-bv-navy/12 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        right:  'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-bv-navy/12 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
      },
    },
    defaultVariants: { side: 'right' },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), 'p-bv-6', className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-bv-4 top-bv-4 h-9 w-9 rounded-bv-sm flex items-center justify-center text-bv-navy/40 hover:text-bv-navy hover:bg-bv-navy-50 transition-colors duration-bv-fast focus-visible:outline-none focus-visible:shadow-bv-focus">
        <X className="h-5 w-5" />
        <span className="sr-only">Fechar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-bv-2 mb-bv-5', className)} {...props} />
);

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto pt-bv-5 flex flex-col-reverse gap-bv-2 sm:flex-row sm:justify-end sm:gap-bv-3', className)} {...props} />
);

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-h3 font-heading font-bold text-bv-navy', className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-body text-bv-navy/72', className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
