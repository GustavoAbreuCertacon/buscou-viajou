import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { SupabaseService } from '../../database/supabase.service';
import type { DocSlot } from './uploads.dto';

export interface SignedUpload {
  uploadUrl: string;
  token: string;
  publicUrl: string;
  fileKey: string;
  bucket: string;
  expiresInSeconds: number;
}

@Injectable()
export class UploadsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Gera signed upload URL pra um documento de empresa em cadastro.
   * Path: company-docs/applications/{uuid}-{slot}.pdf
   */
  async signPartnerDoc(slot: DocSlot, filename: string): Promise<SignedUpload> {
    const ext = (filename.split('.').pop() || 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '');
    const fileKey = `applications/${randomUUID()}-${slot}.${ext || 'pdf'}`;
    return this.createSignedUploadUrl('company-docs', fileKey);
  }

  /**
   * Gera signed upload URL pra foto de veículo da empresa logada.
   * Path: vehicle-photos/{company_id}/{uuid}.{ext}
   */
  async signVehiclePhoto(companyId: string, filename: string): Promise<SignedUpload> {
    const ext = (filename.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const fileKey = `${companyId}/${randomUUID()}.${ext || 'jpg'}`;
    return this.createSignedUploadUrl('vehicle-photos', fileKey);
  }

  private async createSignedUploadUrl(bucket: string, fileKey: string): Promise<SignedUpload> {
    const { data, error } = await this.supabase.admin.storage
      .from(bucket)
      .createSignedUploadUrl(fileKey);

    if (error || !data) {
      throw new InternalServerErrorException(
        `Falha ao gerar signed upload URL: ${error?.message ?? 'unknown'}`,
      );
    }

    const supabaseUrl = this.config.getOrThrow<string>('SUPABASE_URL');
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileKey}`;

    return {
      uploadUrl: data.signedUrl,
      token: data.token,
      publicUrl,
      fileKey,
      bucket,
      expiresInSeconds: 60 * 10,
    };
  }
}
