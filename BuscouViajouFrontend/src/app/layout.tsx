import type { Metadata } from 'next';
import { QueryProvider } from '@/lib/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Buscou Viajou — Compare e reserve fretamento de ônibus e vans',
  description:
    'Marketplace de fretamento turístico. Compare preços de dezenas de empresas e reserve em poucos cliques.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Skip to main content (a11y) */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-bv-3 focus:top-bv-3 focus:z-50 focus:bg-bv-navy focus:text-white focus:px-bv-4 focus:py-bv-3 focus:rounded-bv-md focus:shadow-bv-lg focus:font-semibold"
        >
          Pular para o conteúdo
        </a>
        <QueryProvider>
          <TooltipProvider delayDuration={200}>
            {children}
          </TooltipProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
