import {
  Wifi,
  AirVent,
  Toilet,
  Tv,
  Usb,
  Refrigerator,
  Armchair,
  Accessibility,
  Snowflake,
  Music,
  type LucideIcon,
  Sparkles,
} from 'lucide-react';

/**
 * Mapeamento das amenities (do seed estático em supabase) pra ícones Lucide.
 * Ver supabase/migrations/20260429120003_seed_static_data.sql
 */
const AMENITY_ICONS: Record<string, LucideIcon> = {
  'Wi-Fi':           Wifi,
  'Ar-condicionado': AirVent,
  'Banheiro':        Toilet,
  'TV':              Tv,
  'Tomada USB':      Usb,
  'Geladeira':       Refrigerator,
  'Poltrona-leito':  Armchair,
  'Cadeirante':      Accessibility,
  'Cooler':          Snowflake,
  'Som ambiente':    Music,
};

export function getAmenityIcon(name: string): LucideIcon {
  return AMENITY_ICONS[name] ?? Sparkles;
}
