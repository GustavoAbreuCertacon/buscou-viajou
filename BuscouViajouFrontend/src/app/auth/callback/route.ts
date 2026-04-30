import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Callback do magic link.
 * Supabase redireciona pra cá com `?code=...` (PKCE flow).
 * Trocamos o code por uma sessão e redirecionamos pra `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/minhas-viagens';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/erro?reason=missing_code`);
  }

  const response = NextResponse.redirect(`${origin}${safeNext(next)}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options }),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/auth/erro?reason=invalid_code`);
  }

  return response;
}

/** Garante que `next` é interno (começa com /) — evita open redirect */
function safeNext(next: string): string {
  if (next.startsWith('/') && !next.startsWith('//')) return next;
  return '/minhas-viagens';
}
