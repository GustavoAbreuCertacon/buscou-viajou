/**
 * Tipos compartilhados entre frontend e backend.
 * Refletem os DTOs de resposta da API REST.
 */

export interface CityHit {
  label: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export interface QuoteSearchInput {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  vehicleTypes?: ('BUS' | 'MINIBUS' | 'VAN')[];
  minRating?: number;
  maxPrice?: number;
}

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

export interface QuoteSearchResponse {
  data: QuoteResultItem[];
  meta: {
    origin: { name: string; state: string; lat: number; lng: number };
    destination: { name: string; state: string; lat: number; lng: number };
    distanceKm: number;
    estimatedDurationHours: number;
    multiplier: number;
    multiplierIndicator: string;
  };
}

export type BookingStatus =
  | 'PENDING_APPROVAL'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'PENDING_COMPLETION'
  | 'COMPLETED'
  | 'CANCELLED_BY_CLIENT'
  | 'CANCELLED_BY_COMPANY'
  | 'REJECTED'
  | 'EXPIRED'
  | 'NO_SHOW_CLIENT'
  | 'NO_SHOW_COMPANY';

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  average_rating: number;
  total_reviews: number;
  operating_regions: string[];
  description: string | null;
}

export interface CompaniesResponse {
  data: Company[];
}

export interface ReviewClient {
  first_name: string;
  last_initial: string | null;
}

export interface CompanyReview {
  id: string;
  overall_rating: number;
  punctuality_rating: number;
  vehicle_rating: number;
  driver_rating: number;
  value_rating: number;
  comment: string | null;
  created_at: string;
  client: ReviewClient;
  vehicle: { id: string; model: string };
  response: { response: string; created_at: string } | null;
}

export interface ReviewsResponse {
  data: CompanyReview[];
}

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'CLIENT' | 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'COMPANY_OPERATOR' | 'COMPANY_FINANCIAL';
  kyc_status: string;
  company_id: string | null;
  avatar_url: string | null;
  phone: string | null;
  cpf: string | null;
  created_at: string;
}
