/**
 * Server-side fetch helper. Lê o JWT dos cookies via Supabase server client
 * e passa pro backend NestJS via Bearer.
 *
 * Use em Server Components / Route Handlers.
 */
import { createClient } from '@/lib/supabase/server';
import { ApiError } from './client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ServerApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Default true. Se true, anexa Bearer do user logado se houver. */
  auth?: boolean;
  /** Cache strategy. Default 'no-store' pra dados dinâmicos. */
  cache?: RequestCache;
  /** Revalidate em segundos pra ISR */
  revalidate?: number;
}

export async function serverApi<T>(path: string, options: ServerApiOptions = {}): Promise<T> {
  const { body, auth = true, headers, revalidate, cache = 'no-store', ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    try {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        finalHeaders['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch {
      // Sem sessão — sem header
    }
  }

  const baseInit: RequestInit = {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  let response: Response;
  if (revalidate !== undefined) {
    response = await fetch(`${API_URL}${path}`, {
      ...baseInit,
      next: { revalidate },
    });
  } else {
    response = await fetch(`${API_URL}${path}`, { ...baseInit, cache });
  }

  if (!response.ok) {
    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      // sem corpo
    }
    throw new ApiError(
      response.status,
      payload?.title ?? response.statusText,
      payload?.detail ?? `HTTP ${response.status}`,
      payload?.errors,
      payload?.error_id,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}
