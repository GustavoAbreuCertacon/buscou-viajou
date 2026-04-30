import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import { CreateGarageDto, CreateVehicleDto } from './company.dto';

const COMPANY_ROLES = ['COMPANY_ADMIN', 'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'];

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async getCompanyIdForUser(userId: string): Promise<string> {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .select('role, company_id')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      throw new ForbiddenException('Perfil não encontrado');
    }
    if (!COMPANY_ROLES.includes(data.role) || !data.company_id) {
      throw new ForbiddenException('Acesso restrito a usuários de empresa');
    }
    return data.company_id;
  }

  async listGarages(userId: string) {
    const companyId = await this.getCompanyIdForUser(userId);
    const { data, error } = await this.supabase.admin
      .from('garages')
      .select('id, name, street, number, city, state, zip_code, latitude, longitude')
      .eq('company_id', companyId)
      .order('name');

    if (error) throw error;
    return { data: data ?? [] };
  }

  async createGarage(userId: string, dto: CreateGarageDto) {
    const companyId = await this.getCompanyIdForUser(userId);
    const { data, error } = await this.supabase.admin
      .from('garages')
      .insert({
        company_id: companyId,
        name: dto.name,
        street: dto.street,
        number: dto.number,
        city: dto.city,
        state: dto.state,
        zip_code: dto.zipCode,
        latitude: dto.latitude ?? null,
        longitude: dto.longitude ?? null,
      } as any)
      .select('id, name, street, number, city, state, zip_code, latitude, longitude')
      .single();

    if (error || !data) throw error;
    return data;
  }

  async createVehicle(userId: string, dto: CreateVehicleDto) {
    const companyId = await this.getCompanyIdForUser(userId);

    // 1. Garagem precisa pertencer à empresa
    const { data: garage } = await this.supabase.admin
      .from('garages')
      .select('id, company_id')
      .eq('id', dto.garageId)
      .maybeSingle();

    if (!garage) throw new NotFoundException('Garagem não encontrada');
    if (garage.company_id !== companyId) {
      throw new ForbiddenException('Garagem não pertence à sua empresa');
    }

    // 2. Placa única — checa antes pra dar mensagem amigável
    const { data: existingPlate } = await this.supabase.admin
      .from('vehicles')
      .select('id')
      .eq('plate', dto.plate.toUpperCase())
      .maybeSingle();

    if (existingPlate) {
      throw new ConflictException('Já existe um veículo com essa placa');
    }

    // 3. Insere veículo
    const { data: vehicle, error: vErr } = await this.supabase.admin
      .from('vehicles')
      .insert({
        company_id: companyId,
        garage_id: dto.garageId,
        plate: dto.plate.toUpperCase(),
        model: dto.model,
        vehicle_type: dto.vehicleType,
        capacity: dto.capacity,
        price_per_km: dto.pricePerKm,
        min_departure_cost: dto.minDepartureCost,
        dynamic_pricing_enabled: dto.dynamicPricingEnabled ?? true,
        status: dto.status ?? 'ACTIVE',
      } as any)
      .select('id')
      .single();

    if (vErr || !vehicle) {
      this.logger.error(`Falha ao inserir vehicle: ${vErr?.message}`);
      throw vErr;
    }

    // 4. Amenities (M2M)
    if (dto.amenityIds && dto.amenityIds.length > 0) {
      const rows = dto.amenityIds.map((amenityId) => ({
        vehicle_id: vehicle.id,
        amenity_id: amenityId,
      }));
      const { error: amErr } = await this.supabase.admin
        .from('vehicle_amenities')
        .insert(rows);
      if (amErr) {
        this.logger.warn(`Falha ao inserir vehicle_amenities: ${amErr.message}`);
      }
    }

    // 5. Fotos
    if (dto.photoUrls && dto.photoUrls.length > 0) {
      const rows = dto.photoUrls.map((url, i) => ({
        vehicle_id: vehicle.id,
        file_url: url,
        display_order: i,
      }));
      const { error: phErr } = await this.supabase.admin
        .from('vehicle_photos')
        .insert(rows);
      if (phErr) {
        this.logger.warn(`Falha ao inserir vehicle_photos: ${phErr.message}`);
      }
    }

    // 6. Retorna veículo completo
    const { data: full } = await this.supabase.admin
      .from('vehicles')
      .select(
        `
        id, model, vehicle_type, capacity, plate, status, price_per_km, min_departure_cost,
        average_rating, total_reviews,
        photos:vehicle_photos ( file_url, display_order ),
        vehicle_amenities ( amenities ( id, name, icon ) )
      `,
      )
      .eq('id', vehicle.id)
      .single();

    return full;
  }
}
