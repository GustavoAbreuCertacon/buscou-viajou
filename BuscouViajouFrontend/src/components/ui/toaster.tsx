'use client';

import { Toaster as Sonner, toast } from 'sonner';

/**
 * Toaster — usa Sonner por baixo, com tokens do DS aplicados via classNames.
 * design-dna.json → componentRules.toast
 *
 * Uso global: montar <Toaster /> em layout.tsx, depois `toast.success(...)`.
 *
 * Position: bottom-right desktop, top-center mobile (gerenciado por Sonner default em mobile).
 */
export function Toaster(props: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      duration={5000}
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast:
            'rounded-bv-md border border-bv-navy/12 shadow-bv-md p-bv-4 font-body',
          title: 'text-body font-semibold text-bv-navy',
          description: 'text-body-sm text-bv-navy/72',
          actionButton: 'bg-bv-navy text-white text-body-sm font-semibold rounded-bv-sm px-bv-3 py-bv-1',
          cancelButton: 'bg-bv-navy-50 text-bv-navy text-body-sm font-semibold rounded-bv-sm px-bv-3 py-bv-1',
          success: '!bg-bv-green-50 !border-bv-green/30 !text-bv-green-700 [&_[data-icon]]:text-bv-green',
          error:   '!bg-[#FCE8E8] !border-bv-danger/30 !text-[#9C2C2C] [&_[data-icon]]:text-bv-danger',
          warning: '!bg-[#FFF4E0] !border-[#E0A23B]/30 !text-[#A06D1F] [&_[data-icon]]:text-bv-warning',
          info:    '!bg-bv-navy-50 !border-bv-navy/20 !text-bv-navy [&_[data-icon]]:text-bv-navy',
        },
      }}
      {...props}
    />
  );
}

export { toast };
