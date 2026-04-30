import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../database/supabase.service';

const COMPANY_ROLES = ['COMPANY_ADMIN', 'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'];

interface ClientMetadata {
  ip?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class ComplianceService {
  static readonly CURRENT_VERSION = '1.0.0';

  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {}

  getCurrent(): { version: string; documentUrl: string; updatedAt: string } {
    const baseUrl =
      this.config.get<string>('CODE_OF_CONDUCT_PUBLIC_URL') ||
      'https://buscou-viajou.vercel.app/legal/codigo-de-conduta-empresas.docx';
    return {
      version: ComplianceService.CURRENT_VERSION,
      documentUrl: baseUrl,
      updatedAt: '2026-04-30T00:00:00Z',
    };
  }

  async getStatus(userId: string): Promise<{
    companyId: string;
    accepted: boolean;
    currentVersion: string;
    acceptedVersion: string | null;
    acceptedAt: string | null;
  }> {
    const profile = await this.requireCompanyProfile(userId);
    const { data } = await this.supabase.admin
      .from('company_compliance_acceptances')
      .select('document_version, accepted_at')
      .eq('company_id', profile.company_id)
      .eq('document_version', ComplianceService.CURRENT_VERSION)
      .maybeSingle();

    return {
      companyId: profile.company_id,
      accepted: !!data,
      currentVersion: ComplianceService.CURRENT_VERSION,
      acceptedVersion: data?.document_version ?? null,
      acceptedAt: data?.accepted_at ?? null,
    };
  }

  async accept(
    userId: string,
    meta: ClientMetadata,
  ): Promise<{ acceptedAt: string; version: string }> {
    const profile = await this.requireCompanyProfile(userId);
    const current = this.getCurrent();

    const { data, error } = await this.supabase.admin
      .from('company_compliance_acceptances')
      .upsert(
        {
          company_id: profile.company_id,
          accepted_by_user_id: userId,
          document_version: current.version,
          document_url: current.documentUrl,
          ip_address: meta.ip ?? null,
          user_agent: meta.userAgent ?? null,
        },
        { onConflict: 'company_id,document_version' },
      )
      .select('accepted_at, document_version')
      .single();

    if (error || !data) {
      throw error;
    }

    return { acceptedAt: data.accepted_at, version: data.document_version };
  }

  private async requireCompanyProfile(userId: string): Promise<{ company_id: string }> {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .select('role, company_id')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data || !COMPANY_ROLES.includes(data.role) || !data.company_id) {
      throw new ForbiddenException(
        'Apenas usuários com perfil de empresa podem operar o aceite de código.',
      );
    }
    return { company_id: data.company_id };
  }
}
