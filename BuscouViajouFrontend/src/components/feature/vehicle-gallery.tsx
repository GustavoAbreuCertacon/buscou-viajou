'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Bus, Maximize2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils/cn';

interface Props {
  photos: string[];
  alt?: string;
  className?: string;
}

/**
 * VehicleGallery — carousel de fotos com lightbox.
 * Usado em /veiculo/[id] (PRD §6.11 Seção 1).
 *
 * - Foto principal grande (16:10)
 * - Thumbnails embaixo
 * - Click ou keyboard navega
 * - "Ver todas" abre lightbox modal
 */
export function VehicleGallery({ photos, alt = 'Foto do veículo', className }: Props) {
  const [index, setIndex] = React.useState(0);
  const total = photos.length;

  const prev = React.useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);
  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (total === 0) {
    return (
      <div className={cn('aspect-[16/10] rounded-bv-lg bg-bv-navy-50 flex items-center justify-center', className)}>
        <div className="text-center text-bv-navy/48 space-y-bv-2">
          <Bus className="h-12 w-12 mx-auto" />
          <p className="text-body-sm">Foto não disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-bv-3', className)}>
      <div className="relative aspect-[16/10] rounded-bv-lg overflow-hidden bg-bv-navy-50 group">
        <Image
          src={photos[index]}
          alt={`${alt} ${index + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          priority
          className="object-cover"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-bv-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-bv-navy shadow-bv-md flex items-center justify-center transition-all duration-bv-fast focus-visible:outline-none focus-visible:shadow-bv-focus opacity-0 group-hover:opacity-100"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-bv-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-bv-navy shadow-bv-md flex items-center justify-center transition-all duration-bv-fast focus-visible:outline-none focus-visible:shadow-bv-focus opacity-0 group-hover:opacity-100"
              aria-label="Próxima foto"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="absolute right-bv-3 bottom-bv-3 inline-flex items-center gap-1 rounded-bv-md bg-white/90 hover:bg-white text-bv-navy text-body-sm font-semibold px-bv-3 py-bv-2 shadow-bv-md transition-all duration-bv-fast focus-visible:outline-none focus-visible:shadow-bv-focus"
              aria-label="Ver todas as fotos em tela cheia"
            >
              <Maximize2 size={14} strokeWidth={2.5} />
              Ver todas
            </button>
          </DialogTrigger>
          <DialogContent size="lg" className="bg-bv-navy text-white p-0 max-w-6xl">
            <div className="relative aspect-video">
              <Image
                src={photos[index]}
                alt={`${alt} ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-bv-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-bv-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            <p className="absolute bottom-bv-3 left-1/2 -translate-x-1/2 text-caption font-semibold tabular-nums bg-white/10 rounded-bv-pill px-bv-3 py-1">
              {index + 1} / {total}
            </p>
          </DialogContent>
        </Dialog>

        {total > 1 && (
          <p className="absolute bottom-bv-3 left-bv-3 text-caption font-semibold tabular-nums bg-bv-navy/72 text-white rounded-bv-pill px-bv-3 py-1">
            {index + 1} / {total}
          </p>
        )}
      </div>

      {total > 1 && (
        <div className="grid grid-cols-5 gap-bv-2">
          {photos.slice(0, 5).map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'relative aspect-[4/3] rounded-bv-sm overflow-hidden bg-bv-navy-50',
                'transition-all duration-bv-fast',
                'focus-visible:outline-none focus-visible:shadow-bv-focus',
                i === index
                  ? 'ring-2 ring-bv-green ring-offset-2'
                  : 'opacity-72 hover:opacity-100',
              )}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index || undefined}
            >
              <Image
                src={p}
                alt=""
                fill
                sizes="(max-width: 768px) 20vw, 160px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
