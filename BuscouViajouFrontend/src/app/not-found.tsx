import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading, BicolorHighlight } from '@/components/ui/bicolor-heading';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="bv-canvas flex items-center justify-center py-bv-9 px-bv-4">
        <div className="max-w-md text-center space-y-bv-5 bg-white rounded-bv-lg shadow-bv-md p-bv-7">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-bv-navy-50 text-bv-navy mx-auto">
            <Compass className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading font-black leading-tight text-h1 md:text-display tracking-tight">
            <span className="text-bv-navy">Buscou aqui? </span>
            <span className="text-bv-green">Sem rota.</span>
          </h1>
          <p className="text-body text-bv-navy/72">
            A página que você procura não existe ou foi movida.
          </p>
          <div className="flex flex-col gap-bv-2">
            <Button asChild variant="accent" size="lg" fullWidth>
              <Link href="/">Voltar pra home</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" fullWidth>
              <Link href="/busca">Buscar veículos</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
