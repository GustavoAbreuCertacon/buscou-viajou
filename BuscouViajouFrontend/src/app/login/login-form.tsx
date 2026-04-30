'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils/cn';

interface Props {
  next: string;
}

export function LoginForm({ next }: Props) {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  const [consent, setConsent] = React.useState(false);
  const [consentError, setConsentError] = React.useState(false);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function send(emailToSend: string) {
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error: err } = await supabase.auth.signInWithOtp({
        email: emailToSend,
        options: { emailRedirectTo: redirectTo },
      });
      if (err) {
        if (err.status === 429) {
          setError('Muitas tentativas. Aguarde alguns minutos.');
        } else {
          setError('Não conseguimos enviar o link. Tente novamente.');
        }
        return false;
      }
      setSent(emailToSend);
      setCooldown(60);
      return true;
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Informe um e-mail.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (!consent) {
      setConsentError(true);
      toast.warning('Aceite necessário', {
        description:
          'Você precisa aceitar os Termos de Uso e Política de Privacidade pra continuar.',
      });
      return;
    }
    const ok = await send(email);
    if (ok) toast.success('Link enviado!', { description: `Confira ${email}` });
  }

  if (sent) {
    return (
      <div className="text-center space-y-bv-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-bv-green-50 text-bv-green-700 mx-auto">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
        </div>
        <div>
          <p className="text-h4 font-heading font-bold text-bv-navy">Confira sua caixa de entrada</p>
          <p className="mt-bv-2 text-body text-bv-navy/72">
            Enviamos um link pra <strong className="text-bv-navy">{sent}</strong>.<br />
            É só clicar pra entrar.
          </p>
        </div>
        <div className="text-body-sm text-bv-navy/72">
          Não recebeu? Verifique a pasta de spam.
        </div>
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          disabled={cooldown > 0 || loading}
          onClick={() => send(sent)}
          loading={loading}
        >
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar link'}
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setSent(null);
            setEmail('');
            setError(null);
          }}
        >
          Usar outro e-mail
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-bv-4">
      <div className="space-y-bv-2">
        <Label htmlFor="email" required>
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder="seu@email.com"
          iconLeft={<Mail className="h-4 w-4" />}
          error={error ?? undefined}
        />
      </div>

      {/* Consent LGPD — exigido pra qualquer cadastro */}
      <div className="flex items-start gap-bv-3 pt-bv-1">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(c) => {
            setConsent(c === true);
            if (c === true) setConsentError(false);
          }}
          aria-invalid={consentError || undefined}
          className={cn(consentError && 'border-bv-danger ring-2 ring-bv-danger/20')}
        />
        <label
          htmlFor="consent"
          className={cn(
            'text-body-sm leading-relaxed cursor-pointer select-none',
            consentError ? 'text-bv-danger' : 'text-bv-navy/80',
          )}
        >
          Li e concordo com os{' '}
          <Link
            href="/termos"
            className="text-bv-green font-semibold underline underline-offset-4 hover:text-bv-green-700"
            target="_blank"
            rel="noopener"
          >
            Termos de Uso e Política de Privacidade
          </Link>{' '}
          da Buscou Viajou e entendo que a plataforma atua apenas como
          intermediadora de comparação de preços.
        </label>
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Enviando…"
        iconRight={<ArrowRight className="h-4 w-4" />}
      >
        Enviar link mágico
      </Button>
    </form>
  );
}
