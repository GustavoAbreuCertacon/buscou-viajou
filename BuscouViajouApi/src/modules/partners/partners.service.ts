import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import { PartnerSignupDto } from './partners.dto';

interface ClientMetadata {
  ip?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class PartnersService {
  private readonly logger = new Logger(PartnersService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async signup(dto: PartnerSignupDto, meta: ClientMetadata): Promise<{
    applicationId: string;
    status: string;
    message: string;
  }> {
    // 1. Checa CNPJ duplicado em aplicações vivas (PENDING/APPROVED)
    const { data: existing } = await this.supabase.admin
      .from('partner_applications')
      .select('id, status')
      .eq('cnpj', dto.cnpj)
      .in('status', ['PENDING_APPROVAL', 'PENDING_DOCUMENTS', 'APPROVED'])
      .maybeSingle();

    if (existing) {
      throw new ConflictException(
        'Este CNPJ já possui um cadastro em andamento ou aprovado. Entre em contato com o suporte.',
      );
    }

    // 2. Insere aplicação
    const { data, error } = await this.supabase.admin
      .from('partner_applications')
      .insert({
        legal_name: dto.legalName,
        trade_name: dto.tradeName,
        cnpj: dto.cnpj,
        address_street: dto.addressStreet,
        address_number: dto.addressNumber,
        address_complement: dto.addressComplement ?? null,
        address_city: dto.addressCity,
        address_state: dto.addressState,
        address_zip: dto.addressZip,
        company_phone: dto.companyPhone,
        representative_name: dto.representativeName,
        representative_cpf: dto.representativeCpf,
        representative_email: dto.representativeEmail,
        representative_phone: dto.representativePhone,
        representative_role: dto.representativeRole,
        estimated_vehicle_count: dto.estimatedVehicleCount,
        vehicle_types: dto.vehicleTypes,
        operating_regions: dto.operatingRegions,
        description: dto.description ?? null,
        social_contract_file_url: dto.socialContractFileUrl,
        permit_file_url: dto.permitFileUrl,
        antt_file_url: dto.anttFileUrl,
        status: 'PENDING_APPROVAL',
        code_of_conduct_version: dto.codeOfConductVersion,
        code_of_conduct_accepted_at: new Date().toISOString(),
        acceptance_ip: meta.ip ?? null,
        acceptance_user_agent: meta.userAgent ?? null,
      } as any)
      .select('id, status')
      .single();

    if (error || !data) {
      this.logger.error(`Falha ao inserir partner_application: ${error?.message}`);
      throw error;
    }

    return {
      applicationId: data.id,
      status: data.status,
      message:
        'Recebemos seu cadastro! Nosso time analisará em até 48 horas úteis e responderá no e-mail informado.',
    };
  }
}
