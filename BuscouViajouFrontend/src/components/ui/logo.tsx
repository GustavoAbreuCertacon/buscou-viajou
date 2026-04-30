import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

type LogoVariant =
  | 'fullColor'         // V1 — primária (SVG)
  | 'whiteOnNavy'       // V2 (PNG, com bg navy embutido)
  | 'whiteOnGreen'      // V3 (PNG, com bg green embutido)
  | 'black'             // V4 (PNG transparente, tudo preto)
  | 'white'             // V5 (PNG transparente, tudo branco)
  | 'monogramFullColor' // só BV
  | 'monogramWhite'     // só BV branco
  | 'monogramBlack';    // só BV preto

// Aspects medidos após `sharp.trim()` nos PNGs novos (Material Id v2):
// - lockups horizontais (color/black/white): ~5.5
// - lockup empilhado: ~1.79
// - monograma BV color: ~1.66
const VARIANTS: Record<LogoVariant, { src: string; aspect: number; alt: string }> = {
  fullColor: {
    src: '/brand/logo-color-horizontal.png',
    aspect: 4988 / 911,
    alt: 'Buscou Viajou',
  },
  whiteOnNavy: {
    src: '/brand/logo-white-on-navy.png',
    aspect: 1200 / 500,
    alt: 'Buscou Viajou',
  },
  whiteOnGreen: {
    src: '/brand/logo-white-on-green.png',
    aspect: 1200 / 500,
    alt: 'Buscou Viajou',
  },
  black: {
    src: '/brand/logo-black.png',
    aspect: 5083 / 930,
    alt: 'Buscou Viajou',
  },
  white: {
    src: '/brand/logo-white.png',
    aspect: 5094 / 927,
    alt: 'Buscou Viajou',
  },
  monogramFullColor: {
    src: '/brand/monogram-bv-full-color.png',
    aspect: 2744 / 1656,
    alt: 'BV',
  },
  monogramWhite: {
    src: '/brand/monogram-bv-white.png',
    aspect: 1,
    alt: 'BV',
  },
  monogramBlack: {
    src: '/brand/monogram-bv-black.png',
    aspect: 1,
    alt: 'BV',
  },
};

export interface LogoProps {
  variant?: LogoVariant;
  /**
   * Altura em px. Largura é calculada automaticamente pelo aspect ratio.
   * Default: 32px (Navbar). 24 pra navbar mobile compacta. 64+ pra hero.
   */
  height?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}

export function Logo({
  variant = 'fullColor',
  height = 32,
  className,
  priority = false,
  alt,
}: LogoProps) {
  const meta = VARIANTS[variant];
  const width = Math.round(height * meta.aspect);
  return (
    <Image
      src={meta.src}
      alt={alt ?? meta.alt}
      width={width}
      height={height}
      priority={priority}
      className={cn('select-none', className)}
      draggable={false}
    />
  );
}
