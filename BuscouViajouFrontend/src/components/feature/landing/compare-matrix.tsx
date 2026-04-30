import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * CompareMatrix — diferenciação visual de "comprar direto" vs "Buscou Viajou".
 * Layout editorial: <table> semântica com headers diferenciados.
 *
 * Coluna esquerda (direto) = neutra com X em vermelho discreto.
 * Coluna direita (BV) = destaque navy com ✓ verde — mais peso visual,
 * indica a escolha "certa" sem dizer.
 *
 * design-dna.json → componentRules.cards (variant brand) + paleta proporção 60/30/10
 */
export interface CompareRow {
  /** Texto do método tradicional (esquerda) */
  direct: string;
  /** Texto do método BV (direita) */
  buscou: string;
}

const ROWS: CompareRow[] = [
  {
    direct: 'Ligar ou mandar WhatsApp pra cada empresa',
    buscou: 'Cotação simultânea de várias empresas em um só lugar',
  },
  {
    direct: 'Esperar resposta horas ou dias',
    buscou: 'Resultados em segundos, atualizados pelas empresas',
  },
  {
    direct: 'Sem visão lado a lado pra comparar',
    buscou: 'Tudo numa tela: preço, avaliação, comodidades e capacidade',
  },
  {
    direct: 'Sem como conferir reputação real da empresa',
    buscou: 'Avaliações independentes de viajantes verificados',
  },
  {
    direct: 'Só descobre comodidades depois de fechar',
    buscou: 'Filtros por capacidade, avaliação, tipo de veículo e preço',
  },
  {
    direct: 'Sem garantia de padrão mínimo de qualidade',
    buscou: 'Empresas com baixo desempenho saem da rede',
  },
];

export function CompareMatrix({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-bv-lg border border-bv-navy/12', className)}>
      <table className="w-full">
        <caption className="sr-only">
          Comparação entre comprar fretamento direto com a empresa e usar Buscou Viajou.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="bg-bv-bg w-1/2 px-bv-4 md:px-bv-5 py-bv-4 text-left align-bottom"
            >
              <span className="block text-caption font-bold uppercase tracking-[0.14em] text-bv-navy/60">
                método tradicional
              </span>
              <span className="mt-bv-1 block font-heading font-bold text-h4 md:text-h3 text-bv-navy/72">
                Comprar direto
              </span>
            </th>
            <th
              scope="col"
              className="relative bg-bv-navy w-1/2 px-bv-4 md:px-bv-5 py-bv-4 text-left align-bottom"
            >
              {/* Decoração: linha verde fina no topo da coluna BV (assina o "favorito") */}
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-bv-green" />
              <span className="block text-caption font-bold uppercase tracking-[0.14em] text-bv-green-300">
                como funciona aqui
              </span>
              <span className="mt-bv-1 block font-heading font-bold text-h4 md:text-h3">
                <span className="text-white">Buscou </span>
                <span className="text-bv-green-300">Viajou</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bv-navy/8 [&>tr]:divide-x [&>tr]:divide-bv-navy/8">
          {ROWS.map((row, i) => (
            <tr key={i} className="bg-white">
              <td className="px-bv-4 md:px-bv-5 py-bv-4 align-top">
                <span className="flex gap-bv-3 text-body text-bv-navy/72">
                  <X
                    size={20}
                    strokeWidth={2.5}
                    className="shrink-0 text-bv-danger/72 mt-0.5"
                    aria-hidden
                  />
                  <span>{row.direct}</span>
                </span>
              </td>
              <td className="px-bv-4 md:px-bv-5 py-bv-4 align-top bg-white">
                <span className="flex gap-bv-3 text-body text-bv-navy font-medium">
                  <Check
                    size={20}
                    strokeWidth={2.5}
                    className="shrink-0 text-bv-green mt-0.5"
                    aria-hidden
                  />
                  <span>{row.buscou}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
