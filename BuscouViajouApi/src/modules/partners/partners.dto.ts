import { z } from 'zod';

const VEHICLE_TYPES = ['BUS', 'MINIBUS', 'VAN'] as const;
const FLEET_SIZE = ['1-5', '6-15', '16-50', '50+'] as const;
const UF = z.string().regex(/^[A-Z]{2}$/, 'UF deve ter 2 letras maiúsculas');

const CnpjSchema = z
  .string()
  .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX');

const CpfSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX');

const PhoneSchema = z.string().min(10).max(20);

export const PartnerSignupSchema = z.object({
  // Etapa 1 — Empresa
  legalName: z.string().min(5).max(255),
  tradeName: z.string().min(2).max(255),
  cnpj: CnpjSchema,
  addressStreet: z.string().min(2).max(255),
  addressNumber: z.string().min(1).max(20),
  addressComplement: z.string().max(100).optional().nullable(),
  addressNeighborhood: z.string().max(100).optional().nullable(),
  addressCity: z.string().min(2).max(100),
  addressState: UF,
  addressZip: z.string().min(8).max(10),
  companyPhone: PhoneSchema,

  // Etapa 2 — Responsável
  representativeName: z.string().min(5).max(255),
  representativeCpf: CpfSchema,
  representativeEmail: z.string().email().max(255),
  representativePhone: PhoneSchema,
  representativeRole: z.string().min(2).max(100),

  // Etapa 3 — Documentos & Frota
  // Documentos são opcionais no envio inicial; o time pode solicitar via
  // status PENDING_DOCUMENTS durante a análise.
  socialContractFileUrl: z.string().url().optional().nullable(),
  permitFileUrl: z.string().url().optional().nullable(),
  anttFileUrl: z.string().url().optional().nullable(),
  estimatedVehicleCount: z.enum(FLEET_SIZE),
  vehicleTypes: z.array(z.enum(VEHICLE_TYPES)).min(1),
  operatingRegions: z.array(UF).min(1),
  description: z.string().max(500).optional().nullable(),

  // Etapa 4 — Aceite do código de conduta
  codeOfConductVersion: z.string().min(1).max(20),
  codeOfConductAccepted: z.literal(true, {
    errorMap: () => ({ message: 'É necessário aceitar o código de conduta pra concluir' }),
  }),
});

export type PartnerSignupDto = z.infer<typeof PartnerSignupSchema>;
