'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';

const COMPANY_ROLES = ['COMPANY_ADMIN', 'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'];

export function CompanyLoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Informe e-mail e senha.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authErr) {
        setError(
          authErr.status === 400
            ? 'E-mail ou senha incorretos.'
            : 'Não conseguimos entrar. Tente novamente.',
        );
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        setError('Sessão inválida. Tente novamente.');
        return;
      }

      const { data: profileRaw } = await supabase
        .from('profiles')
        .select('role, company_id')
        .eq('id', userId)
        .maybeSingle();

      const profile = profileRaw as { role?: string | null; company_id?: string | null } | null;
      const role = profile?.role ?? '';
      if (!COMPANY_ROLES.includes(role)) {
        await supabase.auth.signOut();
        setError(
          'Esta área é exclusiva pra empresas parceiras. Se você é cliente, use o login com link mágico.',
        );
        return;
      }
      if (!profile?.company_id) {
        await supabase.auth.signOut();
        setError('Sua conta ainda não está vinculada a uma empresa. Fale com o suporte.');
        return;
      }

      toast.success('Bem-vindo!', { description: 'Carregando seu painel...' });
      router.push('/empresa');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-bv-4">
      <div className="space-y-bv-2">
        <Label htmlFor="company-email" required>
          E-mail corporativo
        </Label>
        <Input
          id="company-email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder="admin@suaempresa.com.br"
          iconLeft={<Mail className="h-4 w-4" />}
          disabled={loading}
        />
      </div>

      <div className="space-y-bv-2">
        <Label htmlFor="company-password" required>
          Senha
        </Label>
        <Input
          id="company-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          placeholder="••••••••"
          iconLeft={<Lock className="h-4 w-4" />}
          disabled={loading}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-bv-2 rounded-bv-md bg-[#FCE8E8] border border-bv-danger/30 p-bv-3 text-body-sm text-[#9C2C2C]"
        >
          <AlertCircle size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Entrando…"
        iconRight={<ArrowRight className="h-4 w-4" />}
      >
        Entrar no painel
      </Button>
    </form>
  );
}
