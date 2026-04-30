import { z } from 'zod';

export const SearchQuoteSchema = z.object({
  origin: z.string().min(2, 'Origem obrigatória'),
  destination: z.string().min(2, 'Destino obrigatório'),
  departureDate: z.string().datetime({ offset: true }),
  returnDate: z.string().datetime({ offset: true }).optional(),
  passengers: z.number().int().positive().max(60),
  vehicleTypes: z.array(z.enum(['BUS', 'MINIBUS', 'VAN'])).optional(),
  minRating: z.number().min(1).max(5).optional(),
  maxPrice: z.number().positive().optional(),
});

export type SearchQuoteDto = z.infer<typeof SearchQuoteSchema>;

export interface QuoteResultItem {
  vehicleId: string;
  lockedQuoteId: string;
  model: string;
  vehicleType: 'BUS' | 'MINIBUS' | 'VAN';
  capacity: number;
  averageRating: number;
  totalReviews: number;
  photos: string[];
  amenities: { id: string; name: string; icon: string | null }[];
  company: {
    id: string;
    name: string;
    logoUrl: string | null;
    averageRating: number;
    totalReviews: number;
  };
  pricing: {
    basePrice: number;
    multiplier: number;
    finalPrice: number;
    indicator: 'NORMAL' | 'HIGH' | 'VERY_HIGH' | 'PEAK' | 'PROMO';
    indicatorLabel: string;
    lockedUntil: string;
  };
  route: {
    distanceKm: number;
    estimatedDurationHours: number;
  };
}
