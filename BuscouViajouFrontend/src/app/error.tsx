'use client';

import * as React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading, BicolorHighlight } from '@/components/ui/bicolor-heading';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main id="main" className="bv-canvas flex items-center justify-center py-bv-9 px-bv-4">
        <div className="max-w-md text-center space-y-bv-5 bg-white rounded-bv-lg shadow-bv-md p-bv-7">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#FCE8E8] text-bv-danger mx-auto">
            <AlertOctagon className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <BicolorHeading as="h1" size="h2">
            Algo deu errado <BicolorHighlight>por aqui.</BicolorHighlight>
          </BicolorHeading>
          <p className="text-body text-bv-navy/72">
            Nossa equipe foi notificada e está trabalhando pra resolver.
            Pode tentar de novo ou voltar pra home.
          </p>
          {error.digest && (
            <p className="text-caption font-mono text-bv-navy/48">
              Código: {error.digest}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-bv-2">
            <Button
              variant="accent"
              size="lg"
              fullWidth
              iconLeft={<RefreshCw className="h-4 w-4" />}
              onClick={reset}
            >
              Tentar de novo
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
