import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

export interface SupabaseJwtPayload extends JWTPayload {
  sub: string;          // user UUID (auth.users.id)
  email?: string;
  role: string;         // 'authenticated' | 'anon'
  aud: string;          // 'authenticated'
  exp: number;
  iat: number;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

@Injectable()
export class JwksService implements OnModuleInit {
  private jwks!: ReturnType<typeof createRemoteJWKSet>;
  private issuer!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const supabaseUrl = this.config.getOrThrow<string>('SUPABASE_URL');
    this.issuer = `${supabaseUrl}/auth/v1`;
    this.jwks = createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`));
  }

  async verify(token: string): Promise<SupabaseJwtPayload> {
    const { payload } = await jwtVerify(token, this.jwks, {
      issuer: this.issuer,
    });
    return payload as SupabaseJwtPayload;
  }
}
