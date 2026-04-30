import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export type DbClient = SupabaseClient<Database>;

@Injectable()
export class SupabaseService implements OnModuleInit {
  private adminClient!: DbClient;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const url = this.config.getOrThrow<string>('SUPABASE_URL');
    const serviceKey = this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.adminClient = createClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  /**
   * Client com service_role key — bypassa RLS.
   * Usar com cuidado: APENAS em endpoints onde a autorização foi validada.
   */
  get admin(): DbClient {
    return this.adminClient;
  }

  /**
   * Cria um client autenticado pelo JWT do usuário.
   * Respeita RLS — recomendado quando se quer aplicar as policies do banco.
   */
  forUser(userJwt: string): DbClient {
    const url = this.config.getOrThrow<string>('SUPABASE_URL');
    const anonKey = this.config.getOrThrow<string>('SUPABASE_ANON_KEY');

    return createClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: { Authorization: `Bearer ${userJwt}` },
      },
    });
  }
}
