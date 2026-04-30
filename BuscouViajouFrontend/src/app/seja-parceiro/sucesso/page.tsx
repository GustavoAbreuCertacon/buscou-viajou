import Link from 'next/link';
import { CheckCircle2, Mail, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function SucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; id?: string }>;
}) {
  const params = await searchParams;
  const email = params.email;
  const id = params.id;

  return (
    <>
      <Navbar />
      <main
        id="main"
        className="bg-bv-bg min-h-[calc(100vh-4rem)] flex items-center justify-center py-bv-7 px-bv-4"
      >
        <div className="w-full max-w-xl">
          <div className="rounded-bv-lg bg-white shadow-bv-lg p-bv-7 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-bv-green-50 text-bv-green-700 mx-auto mb-bv-4">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
            </div>
            <BicolorHeading as="h1" size="h2" navy="Cadastro" green="recebido!" />
            <p className="mt-bv-3 text-body text-bv-navy/72">
              Seu pré-cadastro foi enviado com sucesso. Nosso time de Gestão de Parceiros
              vai analisar tudo em até <strong>48 horas úteis</strong>.
            </p>

            {email && (
              <div className="mt-bv-5 rounded-bv-md bg-bv-bg p-bv-4 flex items-center gap-bv-3 text-left">
                <Mail size={20} strokeWidth={2} className="text-bv-green shrink-0" />
                <div>
                  <p className="text-body-sm text-bv-navy/72">A resposta será enviada pra</p>
                  <p className="font-semibold text-bv-navy">{email}</p>
                </div>
              </div>
            )}

            {id && (
              <p className="mt-bv-3 text-caption text-bv-navy/60">
                Protocolo: <span className="font-mono">{id.slice(0, 8)}</span>
              </p>
            )}

            <div className="mt-bv-5 rounded-bv-md bg-bv-navy-50 p-bv-4 flex items-start gap-bv-3 text-left">
              <Clock size={20} strokeWidth={2} className="text-bv-navy mt-0.5 shrink-0" />
              <div className="text-body-sm text-bv-navy/80">
                <p className="font-semibold mb-bv-1">O que acontece agora?</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Conferimos os documentos enviados.</li>
                  <li>Validamos o CNPJ e a regularidade da empresa.</li>
                  <li>Enviamos as taxas comerciais propostas no e-mail acima.</li>
                  <li>Você define a senha e acessa o painel.</li>
                </ol>
              </div>
            </div>

            <div className="mt-bv-6 flex flex-col sm:flex-row gap-bv-3 justify-center">
              <Button asChild variant="primary" size="md">
                <Link href="/">Voltar pra home</Link>
              </Button>
              <Button asChild variant="ghost" size="md">
                <Link href="/empresa/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
