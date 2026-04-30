/**
 * Wrapper sobre fetch que adiciona Authorization header com JWT do Supabase
 * e centraliza tratamento de erros (formato RFC 7807 do backend).
 */

import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly title: string,
    public readonly detail: string,
    public readonly errors?: unknown,
    public readonly errorId?: string,
  ) {
    super(detail || title);
    this.name = 'ApiError';
  }
}

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Default true. Quando true, anexa Bearer do user logado se houver. */
  auth?: boolean;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await getAccessToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      // resposta não JSON
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

async function getAccessToken(): Promise<string | undefined> {
  if (typeof window === 'undefined') return undefined;
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  } catch {
    return undefined;
  }
}
