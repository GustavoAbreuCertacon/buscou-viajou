import { z } from 'zod';

const ALLOWED_DOC_TYPES = ['application/pdf'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const DocSlot = z.enum(['social_contract', 'permit', 'antt']);
export type DocSlot = z.infer<typeof DocSlot>;

export const SignPartnerDocSchema = z.object({
  slot: DocSlot,
  contentType: z.string().refine((t) => ALLOWED_DOC_TYPES.includes(t), {
    message: 'Tipo de arquivo não permitido (apenas PDF)',
  }),
  filename: z.string().min(1).max(200),
});
export type SignPartnerDocDto = z.infer<typeof SignPartnerDocSchema>;

export const SignVehiclePhotoSchema = z.object({
  contentType: z.string().refine((t) => ALLOWED_IMAGE_TYPES.includes(t), {
    message: 'Tipo de imagem não permitido (jpeg/png/webp)',
  }),
  filename: z.string().min(1).max(200),
});
export type SignVehiclePhotoDto = z.infer<typeof SignVehiclePhotoSchema>;
