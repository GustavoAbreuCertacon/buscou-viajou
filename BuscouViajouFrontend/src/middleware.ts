import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Middleware de proteção:
 *  - Atualiza cookies de sessão Supabase a cada request
 *  - Redireciona auth-only routes (/minhas-viagens, /reserva/*, /empresa) pra login se sem sessão
 *  - Redireciona /login pra /minhas-viagens se já logado
 *  - Validação fina de role (cliente vs empresa) acontece no Server Component
 *    de cada página (não aqui pra evitar query de banco em todo request)
 */

const CLIENT_PROTECTED_PREFIXES = ['/minhas-viagens', '/reserva', '/conta'];
const COMPANY_PROTECTED_PREFIXES = ['/empresa'];
const COMPANY_PUBLIC_ROUTES = ['/empresa/login'];
const PUBLIC_ONLY_PREFIXES = ['/login'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options }),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isClientProtected = CLIENT_PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
  const isCompanyPublic = COMPANY_PUBLIC_ROUTES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
  const isCompanyProtected =
    !isCompanyPublic &&
    COMPANY_PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
  const isPublicOnly = PUBLIC_ONLY_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (isClientProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isCompanyProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/empresa/login';
    return NextResponse.redirect(url);
  }

  if (isPublicOnly && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/minhas-viagens';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     *  - /api/ (api routes)
     *  - /_next/ (static / image optimization)
     *  - /favicon.ico, /robots.txt, /sitemap.xml
     *  - /brand/, /fonts/ (static assets)
     */
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|brand|fonts).*)',
  ],
};
