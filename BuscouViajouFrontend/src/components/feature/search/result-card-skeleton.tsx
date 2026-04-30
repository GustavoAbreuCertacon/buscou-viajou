import { cn } from '@/lib/utils/cn';

/**
 * ResultCardSkeleton — placeholder com a forma exata do VehicleResultCard.
 * Premium pattern: skeletons que comunicam o que vai aparecer.
 *
 * Usa shimmer dos tokens (bv-skeleton) no globals.css.
 */
export function ResultCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-bv-md bg-white border border-bv-navy/12 overflow-hidden flex flex-col md:flex-row',
        className,
      )}
      aria-hidden
    >
      {/* Foto */}
      <div className="bv-skeleton bg-bv-navy-50 w-full md:w-[320px] aspect-[16/10] md:aspect-auto md:h-auto shrink-0" />

      {/* Conteúdo */}
      <div className="flex flex-col md:flex-row flex-1 p-bv-5 gap-bv-5">
        <div className="flex-1 min-w-0 space-y-bv-3">
          <div className="bv-skeleton h-5 w-24 rounded-bv-pill bg-bv-navy-50" />
          <div className="bv-skeleton h-6 w-3/4 rounded-bv-sm bg-bv-navy-50" />
          <div className="bv-skeleton h-4 w-1/2 rounded-bv-sm bg-bv-navy-50" />
          <div className="flex gap-bv-2 pt-bv-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bv-skeleton h-6 w-12 rounded-bv-pill bg-bv-navy-50"
              />
            ))}
          </div>
        </div>
        <div className="md:w-[200px] md:border-l md:border-bv-navy/8 md:pl-bv-5 flex flex-row md:flex-col justify-between md:justify-center items-start md:items-end gap-bv-3">
          <div className="bv-skeleton h-9 w-32 rounded-bv-sm bg-bv-navy-50" />
          <div className="bv-skeleton h-11 w-32 rounded-bv-md bg-bv-navy-50" />
        </div>
      </div>
    </div>
  );
}

export function FiltersSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-bv-md bg-white border border-bv-navy/12 p-bv-5 space-y-bv-6',
        className,
      )}
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <div className="bv-skeleton h-6 w-20 rounded-bv-sm bg-bv-navy-50" />
        <div className="bv-skeleton h-4 w-12 rounded-bv-sm bg-bv-navy-50" />
      </div>
      {[0, 1, 2, 3].map((s) => (
        <div key={s} className="space-y-bv-3">
          <div className="bv-skeleton h-4 w-24 rounded-bv-sm bg-bv-navy-50" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-bv-3">
              <div className="bv-skeleton h-5 w-5 rounded-bv-sm bg-bv-navy-50" />
              <div className="bv-skeleton h-4 flex-1 rounded-bv-sm bg-bv-navy-50" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
