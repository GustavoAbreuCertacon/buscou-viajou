/**
 * Formatters BR — currency, date, duration, distance.
 * design-dna.json → writingPatterns.numbers
 */
import {
  format as fmt,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const NUMBER = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
});

const DECIMAL = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** R$ 1.234,56 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value == null || value === '') return '—';
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n)) return '—';
  return BRL.format(n);
}

/** 1.234 km */
export function formatDistance(km: number | null | undefined): string {
  if (km == null) return '—';
  return `${NUMBER.format(km)} km`;
}

/** ~6h 30min */
export function formatDuration(hours: number | null | undefined): string {
  if (hours == null) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/** 4.6 — sempre 1 casa decimal */
export function formatRating(rating: number | null | undefined): string {
  if (rating == null) return '—';
  return DECIMAL.format(rating);
}

/** 15 mar 2026 */
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = typeof input === 'string' ? new Date(input) : input;
  return fmt(d, "dd MMM yyyy", { locale: ptBR });
}

/** 15 de março de 2026 */
export function formatDateLong(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = typeof input === 'string' ? new Date(input) : input;
  return fmt(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

/** 08:00 */
export function formatTime(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = typeof input === 'string' ? new Date(input) : input;
  return fmt(d, 'HH:mm', { locale: ptBR });
}

/** 15 mar · 08:00 */
export function formatDateTime(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = typeof input === 'string' ? new Date(input) : input;
  return fmt(d, "dd MMM · HH:mm", { locale: ptBR });
}

/** Hoje, Amanhã, ou nome do dia (+ data se passou) */
export function formatRelativeDay(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isToday(d)) return 'Hoje';
  if (isTomorrow(d)) return 'Amanhã';
  if (isYesterday(d)) return 'Ontem';
  return formatDate(d);
}

/** "em 3 dias", "há 2 horas" */
export function formatTimeFromNow(input: string | Date | null | undefined): string {
  if (!input) return '—';
  const d = typeof input === 'string' ? new Date(input) : input;
  return formatDistanceToNow(d, { locale: ptBR, addSuffix: true });
}

/** 152 → "152 avaliações" / 1 → "1 avaliação" */
export function pluralReviews(count: number): string {
  if (count === 0) return 'sem avaliações';
  if (count === 1) return '1 avaliação';
  return `${NUMBER.format(count)} avaliações`;
}

/** 46 → "46 lugares" / 1 → "1 lugar" */
export function pluralCapacity(count: number): string {
  return count === 1 ? '1 lugar' : `${count} lugares`;
}

export const VEHICLE_TYPE_LABEL: Record<'BUS' | 'MINIBUS' | 'VAN', string> = {
  BUS: 'Ônibus',
  MINIBUS: 'Micro-ônibus',
  VAN: 'Van',
};
