import { z } from 'zod';

const VEHICLE_TYPE = z.enum(['BUS', 'MINIBUS', 'VAN']);
const VEHICLE_STATUS = z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']);

export const CreateGarageSchema = z.object({
  name: z.string().min(2).max(100),
  street: z.string().min(2).max(255),
  number: z.string().min(1).max(20),
  city: z.string().min(2).max(100),
  state: z.string().regex(/^[A-Z]{2}$/),
  zipCode: z.string().min(8).max(10),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});
export type CreateGarageDto = z.infer<typeof CreateGarageSchema>;

export const CreateVehicleSchema = z.object({
  garageId: z.string().uuid(),
  plate: z
    .string()
    .regex(/^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/, 'Placa inválida (formato AAA-1234 ou AAA-1A23 Mercosul)'),
  model: z.string().min(2).max(255),
  vehicleType: VEHICLE_TYPE,
  capacity: z.number().int().min(1).max(80),
  pricePerKm: z.number().positive().max(50),
  minDepartureCost: z.number().positive().max(10000),
  dynamicPricingEnabled: z.boolean().optional().default(true),
  status: VEHICLE_STATUS.optional().default('ACTIVE'),
  amenityIds: z.array(z.string().uuid()).optional().default([]),
  photoUrls: z.array(z.string().url()).max(10).optional().default([]),
});
export type CreateVehicleDto = z.infer<typeof CreateVehicleSchema>;
