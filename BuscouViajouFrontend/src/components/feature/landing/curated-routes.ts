/**
 * Rotas curadas pra seção "Rotas em alta" da landing.
 * Hard-coded — não puxamos /v1/quotes em build time pra evitar custo + stale prices.
 * Cada card linka pra /busca?... preenchendo a query string.
 *
 * Manter alinhado com cidades reconhecidas pelo geocoder backend
 * (BuscouViajouApi/src/common/geo/brazil-cities). Coordenadas vêm de lá.
 */

export interface CuratedRoute {
  origin: { name: string; state: string };
  destination: { name: string; state: string };
  distanceKm: number;
  durationHours: number;
  /** Caption editorial — por que a rota está em alta */
  tagline: string;
  /** Slug usado em chips (curtinho) */
  shortLabel: string;
}

export const CURATED_ROUTES: CuratedRoute[] = [
  {
    origin: { name: 'São Paulo', state: 'SP' },
    destination: { name: 'Campos do Jordão', state: 'SP' },
    distanceKm: 230,
    durationHours: 4,
    tagline: 'Serra paulista no inverno',
    shortLabel: 'SP → Campos do Jordão',
  },
  {
    origin: { name: 'Rio de Janeiro', state: 'RJ' },
    destination: { name: 'Búzios', state: 'RJ' },
    distanceKm: 170,
    durationHours: 3,
    tagline: 'Praia e vida noturna',
    shortLabel: 'RJ → Búzios',
  },
  {
    origin: { name: 'Belo Horizonte', state: 'MG' },
    destination: { name: 'Tiradentes', state: 'MG' },
    distanceKm: 200,
    durationHours: 4,
    tagline: 'Histórico colonial',
    shortLabel: 'BH → Tiradentes',
  },
  {
    origin: { name: 'São Paulo', state: 'SP' },
    destination: { name: 'Ubatuba', state: 'SP' },
    distanceKm: 230,
    durationHours: 4,
    tagline: 'Litoral norte de SP',
    shortLabel: 'SP → Ubatuba',
  },
  {
    origin: { name: 'Curitiba', state: 'PR' },
    destination: { name: 'Foz do Iguaçu', state: 'PR' },
    distanceKm: 640,
    durationHours: 9,
    tagline: 'Cataratas em grupo',
    shortLabel: 'Curitiba → Foz',
  },
  {
    origin: { name: 'Recife', state: 'PE' },
    destination: { name: 'Porto de Galinhas', state: 'PE' },
    distanceKm: 60,
    durationHours: 1,
    tagline: 'Praia perto da capital',
    shortLabel: 'Recife → Porto Galinhas',
  },
];

export function buildSearchUrl(route: CuratedRoute, passengers = 10): string {
  // Data padrão: hoje + 14 dias (datas reais quando o user clicar)
  const date = new Date();
  date.setDate(date.getDate() + 14);
  const dateStr = date.toISOString().slice(0, 10);

  // Backend's geocoder accepts city name only (sem ", UF").
  const params = new URLSearchParams({
    origem: route.origin.name,
    destino: route.destination.name,
    data: dateStr,
    passageiros: String(passengers),
  });
  return `/busca?${params.toString()}`;
}
