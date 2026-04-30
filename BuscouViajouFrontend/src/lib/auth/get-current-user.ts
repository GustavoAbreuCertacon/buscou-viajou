import { createClient } from '@/lib/supabase/server';

export interface CurrentUser {
  id: string;
  email: string | undefined;
  firstName: string;
  lastName: string;
  role: string;
  companyId: string | null;
  avatarUrl: string | null;
}

/**
 * Helper de Server Component pra ler o user logado + profile.
 * Retorna null se não logado.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('first_name, last_name, role, company_id, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  const profile = (data ?? {}) as {
    first_name?: string;
    last_name?: string;
    role?: string;
    company_id?: string | null;
    avatar_url?: string | null;
  };

  return {
    id: user.id,
    email: user.email,
    firstName: profile.first_name ?? user.email?.split('@')[0] ?? 'Você',
    lastName: profile.last_name ?? '',
    role: profile.role ?? 'CLIENT',
    companyId: profile.company_id ?? null,
    avatarUrl: profile.avatar_url ?? null,
  };
}
