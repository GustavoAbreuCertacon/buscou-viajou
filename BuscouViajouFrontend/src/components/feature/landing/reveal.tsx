'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Reveal — wrapper que aplica fade-up quando o conteúdo entra no viewport.
 * Respeita prefers-reduced-motion (CSS já cobre via media query em globals.css).
 *
 * Uso: <Reveal as="section">...</Reveal>
 */
export interface RevealProps {
  children: React.ReactNode;
  /** Tag a renderizar — default 'div' */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
  /** Margem de antecipação. Default '-10% 0px' (revela um pouco antes do user ver) */
  rootMargin?: string;
  /** Threshold do IO. Default 0.1 */
  threshold?: number;
  /** Atraso adicional após disparar, em ms. Default 0 */
  delay?: number;
  /** Roda só uma vez (default true) */
  once?: boolean;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
  'aria-label'?: string;
}

export function Reveal({
  children,
  as = 'div',
  rootMargin = '-10% 0px',
  threshold = 0.1,
  delay = 0,
  once = true,
  className,
  id,
  ...ariaProps
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delay > 0) {
              const t = setTimeout(() => setVisible(true), delay);
              if (once) obs.disconnect();
              return () => clearTimeout(t);
            }
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { rootMargin, threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [delay, once, rootMargin, threshold]);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      id={id}
      {...ariaProps}
      className={cn('bv-reveal', visible && 'is-visible', className)}
    >
      {children}
    </Tag>
  );
}
