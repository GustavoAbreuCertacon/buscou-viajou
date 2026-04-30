import type { Metadata } from 'next';

/**
 * Layout do segmento /dev — área interna de showcase/dev tools.
 * Não indexar nem seguir.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return children;
}
