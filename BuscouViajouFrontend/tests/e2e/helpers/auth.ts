import type { Page, BrowserContext } from '@playwright/test';

/**
 * Faz login programático via Supabase password (bypass do magic link em E2E).
 * Usuários do seed: cliente1@buscouviajou.demo / demo12345
 *
 * Sets cookies via `signInWithPassword` no contexto da página, depois reload
 * pra middleware reconhecer a sessão.
 */
export async function loginAsClient(
  page: Page,
  email = 'cliente1@buscouviajou.demo',
  password = 'demo12345',
): Promise<void> {
  // Garante que a página carregou (pra ter o supabase-js disponível)
  await page.goto('/login');

  await page.evaluate(
    async ({ email, password, supabaseUrl, anonKey }) => {
      const { createBrowserClient } = (await import(
        // @ts-expect-error — ESM CDN URL: resolvido em runtime pelo browser, TS não consegue resolver tipos
        'https://esm.sh/@supabase/ssr@0.5.2'
      )) as { createBrowserClient: (url: string, key: string) => { auth: { signInWithPassword: (a: { email: string; password: string }) => Promise<{ error: Error | null }> } } };
      const supabase = createBrowserClient(supabaseUrl, anonKey);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(`Login falhou: ${error.message}`);
    },
    {
      email,
      password,
      supabaseUrl:
        process.env.NEXT_PUBLIC_SUPABASE_URL ??
        'https://cscblvcqjwxmgzalowop.supabase.co',
      anonKey:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzY2JsdmNxand4bWd6YWxvd29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjczNzAsImV4cCI6MjA5MjIwMzM3MH0.-HfAFNjSA_UU4f2SB1v1_JTB9TW2N9BxVcLURPOPgOE',
    },
  );

  await page.waitForTimeout(900);
}

export async function logout(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const { createBrowserClient } = (await import(
      // @ts-expect-error — ESM CDN URL
      'https://esm.sh/@supabase/ssr@0.5.2'
    )) as { createBrowserClient: (url: string, key: string) => { auth: { signOut: () => Promise<void> } } };
    const supabase = createBrowserClient(
      'https://cscblvcqjwxmgzalowop.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzY2JsdmNxand4bWd6YWxvd29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjczNzAsImV4cCI6MjA5MjIwMzM3MH0.-HfAFNjSA_UU4f2SB1v1_JTB9TW2N9BxVcLURPOPgOE',
    );
    await supabase.auth.signOut();
  });
}

export async function clearSession(context: BrowserContext): Promise<void> {
  await context.clearCookies();
}
