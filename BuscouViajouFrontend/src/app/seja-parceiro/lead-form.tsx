'use client';

import * as React from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils/cn';

/**
 * LeadForm — formulário de cadastro de interesse pra empresas parceiras.
 * Esta é uma demo (Fase 2): registra console.log + toast de confirmação.
 * Em produção: integrar com CRM ou enviar pra um endpoint /v1/leads/partner.
 */
interface FormState {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  fleetSize: string;
  notes: string;
}

const INITIAL: FormState = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  fleetSize: '',
  notes: '',
};

export function LeadForm() {
  const [form, setForm] = React.useState<FormState>(INITIAL);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [consent, setConsent] = React.useState(false);
  const [consentError, setConsentError] = React.useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.companyName.trim()) e.companyName = 'Informe o nome da empresa.';
    if (!form.contactName.trim()) e.contactName = 'Informe seu nome.';
    if (!form.email.trim()) e.email = 'Informe um e-mail.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = 'E-mail inválido.';
    if (!form.city.trim()) e.city = 'Informe a cidade.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      toast.warning('Confira os campos', {
        description: 'Alguns dados estão faltando ou inválidos.',
      });
      return;
    }
    if (!consent) {
      setConsentError(true);
      toast.warning('Aceite necessário', {
        description:
          'Você precisa aceitar os Termos de Uso e Política de Privacidade pra continuar.',
      });
      return;
    }
    setSubmitting(true);

    // Demo: simula latência + log no console
    console.log('[seja-parceiro] novo lead:', form);
    await new Promise((r) => setTimeout(r, 800));

    setSubmitting(false);
    toast.success('Pronto!', {
      description:
        'Recebemos seu cadastro. Nossa equipe entra em contato em até 2 dias úteis.',
    });
    setForm(INITIAL);
    setConsent(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-bv-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-3">
        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="companyName" required>
            Nome da empresa
          </Label>
          <Input
            id="companyName"
            value={form.companyName}
            onChange={(e) => update('companyName', e.target.value)}
            placeholder="Ex.: TransTur SP"
            error={errors.companyName}
          />
        </div>

        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="contactName" required>
            Seu nome
          </Label>
          <Input
            id="contactName"
            value={form.contactName}
            onChange={(e) => update('contactName', e.target.value)}
            placeholder="Ex.: Carlos Silva"
            error={errors.contactName}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-3">
        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="email" required>
            E-mail corporativo
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="contato@suaempresa.com"
            error={errors.email}
          />
        </div>

        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="(11) 90000-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-3">
        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="city" required>
            Cidade-base
          </Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Ex.: São Paulo, SP"
            error={errors.city}
          />
        </div>

        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="fleetSize">Tamanho da frota</Label>
          <Input
            id="fleetSize"
            value={form.fleetSize}
            onChange={(e) => update('fleetSize', e.target.value)}
            placeholder="Ex.: 12 veículos"
          />
        </div>
      </div>

      <div className="flex flex-col gap-bv-2">
        <Label htmlFor="notes">Conte um pouco da sua operação</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Tipos de veículo, regiões atendidas, há quanto tempo opera…"
          rows={3}
        />
      </div>

      {/* Consent LGPD */}
      <div className="flex items-start gap-bv-3 pt-bv-1">
        <Checkbox
          id="lead-consent"
          checked={consent}
          onCheckedChange={(c) => {
            setConsent(c === true);
            if (c === true) setConsentError(false);
          }}
          aria-invalid={consentError || undefined}
          className={cn(consentError && 'border-bv-danger ring-2 ring-bv-danger/20')}
        />
        <label
          htmlFor="lead-consent"
          className={cn(
            'text-body-sm leading-relaxed cursor-pointer select-none',
            consentError ? 'text-bv-danger' : 'text-bv-navy/80',
          )}
        >
          Li e concordo com os{' '}
          <Link
            href="/termos"
            className="text-bv-green font-semibold underline underline-offset-4 hover:text-bv-green-700"
            target="_blank"
            rel="noopener"
          >
            Termos de Uso e Política de Privacidade
          </Link>{' '}
          da Buscou Viajou e entendo que a plataforma atua apenas como
          intermediadora de comparação de preços.
        </label>
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        loading={submitting}
        loadingText="Enviando…"
        iconLeft={<Send className="h-4 w-4" />}
        fullWidth
      >
        Quero anunciar minha frota
      </Button>
    </form>
  );
}
