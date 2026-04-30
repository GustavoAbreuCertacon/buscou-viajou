import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
  /** Cor do ícone (default verde da marca) */
  tone?: 'green' | 'navy' | 'warning';
}

const TONE_CLASS = {
  green: 'bg-bv-green-50 text-bv-green-700',
  navy: 'bg-bv-navy-50 text-bv-navy',
  warning: 'bg-[#FFF4E0] text-[#A06D1F]',
};

export function StatCard({ icon: Icon, label, value, hint, className, tone = 'green' }: Props) {
  return (
    <div
      className={cn(
        'rounded-bv-md bg-white border border-bv-navy/12 p-bv-5 flex items-start gap-bv-3',
        className,
      )}
    >
      <div
        className={cn(
          'h-10 w-10 rounded-bv-sm flex items-center justify-center shrink-0',
          TONE_CLASS[tone],
        )}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-bv-navy/72 leading-tight">{label}</p>
        <p className="mt-bv-1 font-heading font-bold text-h2 text-bv-navy tabular-nums leading-none">
          {value}
        </p>
        {hint && <p className="mt-bv-1 text-caption text-bv-navy/60 leading-tight">{hint}</p>}
      </div>
    </div>
  );
}
