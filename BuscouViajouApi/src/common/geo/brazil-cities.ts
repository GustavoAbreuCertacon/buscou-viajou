/**
 * Catálogo simplificado de cidades brasileiras com lat/lng.
 * Usado na demo pra resolver origem/destino sem depender da Google Places API.
 *
 * Em produção: integrar Google Places API (vide PRD seção 13).
 */

export interface BrazilCity {
  name: string;
  state: string;
  lat: number;
  lng: number;
  aliases?: string[];
}

export const BRAZIL_CITIES: BrazilCity[] = [
  // SP
  { name: 'São Paulo',         state: 'SP', lat: -23.5505, lng: -46.6333, aliases: ['sp', 'sao paulo'] },
  { name: 'Campinas',           state: 'SP', lat: -22.9099, lng: -47.0626 },
  { name: 'Santos',             state: 'SP', lat: -23.9608, lng: -46.3331 },
  { name: 'Campos do Jordão',   state: 'SP', lat: -22.7392, lng: -45.5912, aliases: ['campos do jordao'] },
  { name: 'Ubatuba',            state: 'SP', lat: -23.4339, lng: -45.0710 },
  { name: 'São Sebastião',      state: 'SP', lat: -23.7956, lng: -45.4039, aliases: ['sao sebastiao'] },

  // RJ
  { name: 'Rio de Janeiro',     state: 'RJ', lat: -22.9068, lng: -43.1729, aliases: ['rj', 'rio'] },
  { name: 'Búzios',             state: 'RJ', lat: -22.7469, lng: -41.8819, aliases: ['buzios'] },
  { name: 'Angra dos Reis',     state: 'RJ', lat: -23.0067, lng: -44.3186 },
  { name: 'Petrópolis',         state: 'RJ', lat: -22.5050, lng: -43.1786, aliases: ['petropolis'] },
  { name: 'Paraty',             state: 'RJ', lat: -23.2178, lng: -44.7131 },

  // MG
  { name: 'Belo Horizonte',     state: 'MG', lat: -19.9167, lng: -43.9345, aliases: ['bh', 'beaga'] },
  { name: 'Ouro Preto',         state: 'MG', lat: -20.3856, lng: -43.5035 },
  { name: 'Tiradentes',         state: 'MG', lat: -21.1101, lng: -44.1750 },

  // SC
  { name: 'Florianópolis',      state: 'SC', lat: -27.5949, lng: -48.5482, aliases: ['floripa', 'florianopolis'] },
  { name: 'Balneário Camboriú', state: 'SC', lat: -26.9906, lng: -48.6353, aliases: ['balneario camboriu', 'bc'] },

  // PR
  { name: 'Curitiba',           state: 'PR', lat: -25.4284, lng: -49.2733 },
  { name: 'Foz do Iguaçu',      state: 'PR', lat: -25.5163, lng: -54.5854, aliases: ['foz do iguacu', 'foz'] },

  // BA
  { name: 'Salvador',           state: 'BA', lat: -12.9714, lng: -38.5014 },
  { name: 'Porto Seguro',       state: 'BA', lat: -16.4435, lng: -39.0648 },
  { name: 'Morro de São Paulo', state: 'BA', lat: -13.3781, lng: -38.9131, aliases: ['morro de sao paulo'] },

  // PE
  { name: 'Recife',             state: 'PE', lat: -8.0476,  lng: -34.8770 },
  { name: 'Olinda',             state: 'PE', lat: -8.0089,  lng: -34.8553 },
  { name: 'Porto de Galinhas',  state: 'PE', lat: -8.5099,  lng: -35.0029 },

  // CE
  { name: 'Fortaleza',          state: 'CE', lat: -3.7319,  lng: -38.5267 },
  { name: 'Jericoacoara',       state: 'CE', lat: -2.7975,  lng: -40.5137, aliases: ['jeri'] },

  // DF
  { name: 'Brasília',            state: 'DF', lat: -15.7942, lng: -47.8822, aliases: ['brasilia'] },

  // RS
  { name: 'Porto Alegre',       state: 'RS', lat: -30.0346, lng: -51.2177, aliases: ['poa'] },
  { name: 'Gramado',            state: 'RS', lat: -29.3789, lng: -50.8746 },
];

/**
 * Resolve uma string de busca livre pra uma cidade.
 * Match por nome (case-insensitive, sem acento) ou alias.
 *
 * Aceita fallback "Cidade, UF" — usado pelo CityAutocomplete do frontend
 * que persiste o `label` completo no estado do form.
 */
export function resolveCity(input: string): BrazilCity | null {
  if (!input) return null;
  const tryMatch = (candidate: string): BrazilCity | null => {
    const normalized = normalize(candidate);
    return (
      BRAZIL_CITIES.find(
        (c) =>
          normalize(c.name) === normalized ||
          c.aliases?.some((a) => normalize(a) === normalized),
      ) ?? null
    );
  };

  // 1. Match exato
  const exact = tryMatch(input);
  if (exact) return exact;

  // 2. Fallback: separar "Cidade, UF" e tentar só com o nome
  if (input.includes(',')) {
    const [namePart] = input.split(',');
    return tryMatch(namePart.trim());
  }

  return null;
}

export function searchCities(query: string, limit = 10): BrazilCity[] {
  if (!query) return BRAZIL_CITIES.slice(0, limit);
  const q = normalize(query);
  return BRAZIL_CITIES.filter(
    (c) =>
      normalize(c.name).includes(q) ||
      c.aliases?.some((a) => normalize(a).includes(q)) ||
      normalize(c.state).includes(q),
  ).slice(0, limit);
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

/**
 * Distância Haversine em km entre dois pontos.
 */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371; // raio da Terra em km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}
