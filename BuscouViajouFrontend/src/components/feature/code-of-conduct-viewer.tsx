'use client';

import * as React from 'react';
import { Download, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Rule {
  number: string;
  title: string;
  body: string[];
}

const RULES: Rule[] = [
  {
    number: '1',
    title: 'Atualização de dados (Regra de Ouro)',
    body: [
      'O consumidor confia no que vê. É sua obrigação manter preços, fotos e disponibilidades 100% atualizados na sua área.',
      'Atenção: divergências entre o preço anunciado e o cobrado do cliente geram suspensão imediata da conta.',
    ],
  },
  {
    number: '2',
    title: 'Qualidade das imagens e descrições',
    body: [
      'Sua vitrine é o que vende. Use fotos reais e de alta resolução dos seus veículos.',
      'Descreva detalhadamente os itens de conforto (Ar-condicionado, Wi-Fi, TV, tomadas USB, etc.).',
      'Proibido: fotos de terceiros ou imagens de internet que não correspondam à frota real.',
    ],
  },
  {
    number: '3',
    title: 'Compromisso com o consumidor',
    body: [
      'A Buscou Viajou é a vitrine, mas você é quem realiza a viagem.',
      'Responda solicitações o mais rápido possível — o cliente tem pressa.',
      'Cumpra rigorosamente horários e itinerários acordados.',
      'Mantenha toda a documentação (ANTT, Cadastur, Seguros) em dia. Podemos solicitar comprovantes a qualquer momento.',
    ],
  },
  {
    number: '4',
    title: 'Gestão de avaliações e reclamações',
    body: [
      'A plataforma usa um sistema de notas (estrelas).',
      'Empresas com nota média abaixo de 3,5 estrelas entram em regime de observação.',
      'Em caso de denúncias fundamentadas (veículo em mau estado, falta de segurança, mau atendimento), a Buscou Viajou se reserva o direito de excluir a empresa da plataforma sem aviso prévio, conforme contrato.',
    ],
  },
  {
    number: '5',
    title: 'Financeiro e cancelamentos',
    body: [
      'Mantenha suas faturas em dia pra evitar suspensão automática após 30 dias de atraso.',
      'Em caso de cancelamento de reserva (modelo de comissão), envie o comprovante de estorno ao cliente pra garantir o desconto de 50% da taxa de intermediação.',
    ],
  },
  {
    number: '6',
    title: 'Segurança da conta',
    body: [
      'Seu login e senha são sua assinatura digital. Não compartilhe com terceiros.',
      'Qualquer alteração feita no painel é de sua total responsabilidade jurídica.',
    ],
  },
];

interface Props {
  /** Versão exibida (default 1.0.0) */
  version?: string;
  /** Estado controlado do aceite */
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  /** ID pra label do checkbox */
  id?: string;
  /** URL pública do .docx */
  documentUrl?: string;
  /** Esconde o checkbox (modo só leitura) */
  readOnly?: boolean;
}

export function CodeOfConductViewer({
  version = '1.0.0',
  accepted,
  onAcceptedChange,
  id = 'coc-accept',
  documentUrl = '/legal/codigo-de-conduta-empresas.docx',
  readOnly,
}: Props) {
  return (
    <div className="rounded-bv-md bg-white border border-bv-navy/12 overflow-hidden">
      <header className="flex items-center justify-between gap-bv-3 p-bv-4 border-b border-bv-navy/8 bg-bv-navy-50">
        <div className="flex items-center gap-bv-2">
          <FileText size={18} strokeWidth={2.5} className="text-bv-navy" />
          <span className="font-heading font-bold text-body text-bv-navy">
            Código de Conduta — Empresas Parceiras
          </span>
          <span className="text-caption text-bv-navy/72 ml-2">v{version}</span>
        </div>
        <a
          href={documentUrl}
          download
          className="inline-flex items-center gap-1 text-body-sm font-semibold text-bv-green hover:text-bv-green-700"
        >
          <Download size={14} strokeWidth={2.5} />
          Baixar .docx
        </a>
      </header>

      <div
        className="max-h-[480px] overflow-y-auto p-bv-5 space-y-bv-5"
        role="region"
        aria-label="Conteúdo do código de conduta"
        tabIndex={0}
      >
        <div>
          <h3 className="font-heading font-bold text-h4 text-bv-navy mb-bv-2">
            Bem-vindo à Família Buscou Viajou
          </h3>
          <p className="text-body text-bv-navy/80 leading-relaxed">
            Olá, parceiro(a)! Ficamos felizes em ter sua empresa em nossa plataforma de
            comparação de preços e anúncios. Pra que nossa parceria seja duradoura e
            lucrativa pra ambos, estabelecemos as regras de ouro abaixo, que devem ser
            seguidas rigorosamente.
          </p>
        </div>

        <ol className="space-y-bv-4">
          {RULES.map((rule) => (
            <li
              key={rule.number}
              className="rounded-bv-sm bg-bv-bg p-bv-4 border border-bv-navy/8"
            >
              <div className="flex items-start gap-bv-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-bv-pill bg-bv-green text-white font-heading font-black text-body-sm shrink-0">
                  {rule.number}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-heading font-bold text-body text-bv-navy mb-bv-2">
                    {rule.title}
                  </h4>
                  <div className="space-y-bv-2 text-body-sm text-bv-navy/80 leading-relaxed">
                    {rule.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-bv-sm bg-bv-green-50 border border-bv-green/30 p-bv-4">
          <p className="text-body-sm text-bv-green-700">
            <strong>Dica pro vendedor:</strong> empresas que respondem orçamentos em menos
            de 30 minutos e mantêm fotos reais do interior dos veículos convertem até 3x
            mais reservas.
          </p>
        </div>

        <p className="text-body-sm text-bv-navy/72 italic">
          Atenciosamente, Equipe de Gestão de Parceiros — Buscou Viajou — Fretamento
          Inteligente.
        </p>
      </div>

      {!readOnly && (
        <footer className="flex items-start gap-bv-3 p-bv-4 border-t border-bv-navy/8 bg-bv-bg">
          <Checkbox
            id={id}
            checked={accepted}
            onCheckedChange={(v) => onAcceptedChange(v === true)}
          />
          <Label
            htmlFor={id}
            className="text-body-sm text-bv-navy leading-snug cursor-pointer"
          >
            Li e aceito o Código de Conduta versão <strong>v{version}</strong>. Entendo
            que sua violação pode resultar em suspensão ou exclusão da plataforma.
          </Label>
        </footer>
      )}
    </div>
  );
}
