import { z } from 'zod';

export const CreateBookingSchema = z.object({
  lockedQuoteId: z.string().uuid(),
  passengers: z.number().int().positive().max(60),
  isRoundTrip: z.boolean().default(false),
  returnDate: z.string().datetime({ offset: true }).optional(),
  stops: z
    .array(
      z.object({
        address: z.string().min(2),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
    )
    .optional(),
  addonIds: z.array(z.string().uuid()).optional(),
});

export type CreateBookingDto = z.infer<typeof CreateBookingSchema>;

export const CancelBookingSchema = z.object({
  /**
   * Motivo opcional. Quando preenchido, max 500 chars.
   * Label do frontend é "Motivo (opcional)" — backend respeita isso.
   * PRD §12.3 RN-FIN-002 não exige motivo de cancelamento.
   */
  reason: z.string().max(500).optional(),
});
export type CancelBookingDto = z.infer<typeof CancelBookingSchema>;
