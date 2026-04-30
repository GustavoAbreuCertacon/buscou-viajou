import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SearchResults } from './search-results';
import { SearchForm } from '@/components/feature/search-form';
import {
  ResultCardSkeleton,
  FiltersSkeleton,
} from '@/components/feature/search/result-card-skeleton';
import { BicolorHeading } from '@/components/ui/bicolor-heading';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    origem?: string;
    destino?: string;
    data?: string;
    passageiros?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const userMeta = user ? { firstName: user.firstName } : null;

  const origin = params.origem ?? '';
  const destination = params.destino ?? '';
  const dateStr = params.data ?? '';
  const passengers = Number(params.passageiros) || 1;
  const date = dateStr ? new Date(`${dateStr}T08:00:00`) : undefined;

  const hasMinimum = origin && destination && date;

  return (
    <>
      <Navbar user={userMeta} />

      {/* Header sticky com SearchForm compact */}
      <div className="sticky top-16 z-30 bg-white border-b border-bv-navy/8 shadow-bv-sm">
        <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-4">
          <SearchForm
            variant="compact"
            initialValues={{ origin, destination, date, passengers }}
          />
        </div>
      </div>

      <main id="main" className="bg-bv-bg min-h-[60vh]">
        <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-6">
          {!hasMinimum ? (
            <div className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-7 text-center">
              <BicolorHeading as="h2" size="h2" navy="Comece sua" green="busca." />
              <p className="mt-bv-3 text-body text-bv-navy/72">
                Preencha origem, destino e data acima pra ver veículos disponíveis.
              </p>
            </div>
          ) : (
            <Suspense fallback={<ResultsSkeleton />}>
              <SearchResults
                origin={origin}
                destination={destination}
                date={dateStr}
                passengers={passengers}
              />
            </Suspense>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function ResultsSkeleton() {
  return (
    <>
      <header className="mb-bv-6 space-y-bv-3">
        <div className="bv-skeleton h-4 w-32 rounded-bv-sm bg-bv-navy-50" aria-hidden />
        <div className="bv-skeleton h-10 w-2/3 rounded-bv-sm bg-bv-navy-50" aria-hidden />
        <div className="bv-skeleton h-5 w-1/2 rounded-bv-sm bg-bv-navy-50" aria-hidden />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-bv-5">
        <div className="hidden lg:block">
          <FiltersSkeleton />
        </div>
        <div className="space-y-bv-4">
          {[0, 1, 2].map((i) => (
            <ResultCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
