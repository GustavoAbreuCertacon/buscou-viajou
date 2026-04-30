import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { Button } from '@/components/ui/button';

const REASONS: Record<string, { title: string; message: string }> = {
  missing_code: {
    title: 'Link incompleto',
    message: 'Esse link não tem todas as informações. Pode pedir um novo no login.',
  },
  invalid_code: {
    title: 'Link expirado',
    message: 'Esse link de acesso expirou ou já foi usado. Pode pedir um novo no login.',
  },
  default: {
    title: 'Algo deu errado',
    message: 'Não conseguimos entrar agora. Tente em instantes.',
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const params = await searchParams;
  const reason = params.reason ?? 'default';
  const { title, message } = REASONS[reason] ?? REASONS.default;

  return (
    <>
      <Navbar />
      <main id="main" className="bv-canvas min-h-[calc(100vh-4rem)] flex items-center justify-center px-bv-4">
        <div className="max-w-md text-center space-y-bv-5 bg-white rounded-bv-lg shadow-bv-md p-bv-7">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FCE8E8] text-bv-danger mx-auto">
            <AlertCircle className="h-8 w-8" strokeWidth={2} />
          </div>
          <BicolorHeading as="h1" size="h2" navy={title.split(' ')[0]} green={title.split(' ').slice(1).join(' ')} />
          <p className="text-body text-bv-navy/72">{message}</p>
          <div className="flex flex-col gap-bv-2">
            <Button asChild variant="accent" size="lg" fullWidth>
              <Link href="/login">Voltar pro login</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" fullWidth>
              <Link href="/">Ir pra home</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
