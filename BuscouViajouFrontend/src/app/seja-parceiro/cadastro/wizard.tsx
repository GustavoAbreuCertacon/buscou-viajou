'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeOfConductViewer } from '@/components/feature';
import { toast } from '@/components/ui/toaster';
import { api, ApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils/cn';

// =============================================================================
// Constantes
// =============================================================================

const COC_VERSION = '1.0.0';

const UFs = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
] as const;

const FLEET_SIZES = [
  { value: '1-5', label: '1 a 5 veículos' },
  { value: '6-15', label: '6 a 15 veículos' },
  { value: '16-50', label: '16 a 50 veículos' },
  { value: '50+', label: 'Mais de 50' },
] as const;

const VEHICLE_TYPES = [
  { value: 'BUS', label: 'Ônibus' },
  { value: 'MINIBUS', label: 'Micro-ônibus' },
  { value: 'VAN', label: 'Van' },
] as const;

const STEPS = [
  { id: 1, label: 'Empresa' },
  { id: 2, label: 'Responsável' },
  { id: 3, label: 'Documentos' },
  { id: 4, label: 'Aceite' },
] as const;

// =============================================================================
// Helpers de máscara
// =============================================================================

const onlyDigits = (v: string) => v.replace(/\D/g, '');

function maskCnpj(v: string): string {
  const d = onlyDigits(v).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function maskCpf(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskPhone(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3').replace(/(\d{2})(\d)/, '($1) $2');
  }
  return d.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3').replace(/(\d{2})(\d)/, '($1) $2');
}

function maskZip(v: string): string {
  return onlyDigits(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

// =============================================================================
// Tipos do form
// =============================================================================

interface FormState {
  // Etapa 1
  legalName: string;
  tradeName: string;
  cnpj: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  companyPhone: string;

  // Etapa 2
  representativeName: string;
  representativeCpf: string;
  representativeEmail: string;
  representativePhone: string;
  representativeRole: string;

  // Etapa 3
  socialContractFileUrl: string;
  permitFileUrl: string;
  anttFileUrl: string;
  estimatedVehicleCount: string;
  vehicleTypes: string[];
  operatingRegions: string[];
  description: string;

  // Etapa 4
  codeOfConductAccepted: boolean;
}

const INITIAL: FormState = {
  legalName: '',
  tradeName: '',
  cnpj: '',
  addressStreet: '',
  addressNumber: '',
  addressComplement: '',
  addressNeighborhood: '',
  addressCity: '',
  addressState: '',
  addressZip: '',
  companyPhone: '',
  representativeName: '',
  representativeCpf: '',
  representativeEmail: '',
  representativePhone: '',
  representativeRole: '',
  socialContractFileUrl: '',
  permitFileUrl: '',
  anttFileUrl: '',
  estimatedVehicleCount: '',
  vehicleTypes: [],
  operatingRegions: [],
  description: '',
  codeOfConductAccepted: false,
};

const DRAFT_KEY = 'partnerSignupDraft';

// =============================================================================
// Validação por etapa
// =============================================================================

function validateStep1(s: FormState): string | null {
  if (s.legalName.trim().length < 5) return 'Razão social precisa ter pelo menos 5 caracteres.';
  if (s.tradeName.trim().length < 2) return 'Informe o nome fantasia.';
  if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(s.cnpj)) return 'CNPJ inválido.';
  if (!s.addressStreet.trim() || !s.addressNumber.trim()) return 'Informe rua e número.';
  if (!s.addressCity.trim()) return 'Informe a cidade.';
  if (!/^[A-Z]{2}$/.test(s.addressState)) return 'Selecione o estado.';
  if (s.addressZip.length < 9) return 'CEP inválido.';
  if (s.companyPhone.length < 14) return 'Telefone comercial inválido.';
  return null;
}

function validateStep2(s: FormState): string | null {
  if (s.representativeName.trim().length < 5) return 'Informe o nome completo do responsável.';
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(s.representativeCpf)) return 'CPF inválido.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.representativeEmail)) return 'E-mail inválido.';
  if (s.representativePhone.length < 14) return 'Telefone do responsável inválido.';
  if (!s.representativeRole.trim()) return 'Informe o cargo do responsável.';
  return null;
}

function validateStep3(s: FormState): string | null {
  if (!s.socialContractFileUrl) return 'Envie o contrato social.';
  if (!s.permitFileUrl) return 'Envie o alvará de funcionamento.';
  if (!s.anttFileUrl) return 'Envie a autorização ANTT.';
  if (!s.estimatedVehicleCount) return 'Selecione a quantidade de veículos.';
  if (s.vehicleTypes.length === 0) return 'Selecione ao menos 1 tipo de veículo.';
  if (s.operatingRegions.length === 0) return 'Selecione ao menos 1 estado de atuação.';
  return null;
}

// =============================================================================
// Upload de doc via signed URL
// =============================================================================

async function uploadPartnerDoc(
  file: File,
  slot: 'social_contract' | 'permit' | 'antt',
): Promise<string> {
  const sign = await api<{ uploadUrl: string; token: string; publicUrl: string }>(
    '/v1/uploads/partner-doc',
    {
      method: 'POST',
      auth: false,
      body: { slot, contentType: file.type, filename: file.name },
    },
  );

  const putRes = await fetch(sign.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`Falha no upload: ${putRes.status} ${putRes.statusText}`);
  }
  return sign.publicUrl;
}

// =============================================================================
// Componente principal
// =============================================================================

export function PartnerSignupWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [state, setState] = React.useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = React.useState(false);

  // Restaura rascunho
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      setState((s) => ({ ...s, ...draft, codeOfConductAccepted: false }));
    } catch {
      // ignore
    }
  }, []);

  // Salva rascunho a cada change
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const { codeOfConductAccepted, ...rest } = state;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
  }, [state]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  function handleNext() {
    const validators = [validateStep1, validateStep2, validateStep3, () => null];
    const err = validators[step - 1](state);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit() {
    if (!state.codeOfConductAccepted) {
      toast.error('Você precisa aceitar o código de conduta.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api<{ applicationId: string; status: string; message: string }>(
        '/v1/partners/signup',
        {
          method: 'POST',
          auth: false,
          body: {
            legalName: state.legalName.trim(),
            tradeName: state.tradeName.trim(),
            cnpj: state.cnpj,
            addressStreet: state.addressStreet.trim(),
            addressNumber: state.addressNumber.trim(),
            addressComplement: state.addressComplement.trim() || null,
            addressNeighborhood: state.addressNeighborhood.trim() || null,
            addressCity: state.addressCity.trim(),
            addressState: state.addressState,
            addressZip: state.addressZip,
            companyPhone: state.companyPhone,
            representativeName: state.representativeName.trim(),
            representativeCpf: state.representativeCpf,
            representativeEmail: state.representativeEmail.trim(),
            representativePhone: state.representativePhone,
            representativeRole: state.representativeRole.trim(),
            socialContractFileUrl: state.socialContractFileUrl,
            permitFileUrl: state.permitFileUrl,
            anttFileUrl: state.anttFileUrl,
            estimatedVehicleCount: state.estimatedVehicleCount,
            vehicleTypes: state.vehicleTypes,
            operatingRegions: state.operatingRegions,
            description: state.description.trim() || null,
            codeOfConductVersion: COC_VERSION,
            codeOfConductAccepted: true,
          },
        },
      );
      localStorage.removeItem(DRAFT_KEY);
      router.push(
        `/seja-parceiro/sucesso?email=${encodeURIComponent(state.representativeEmail)}&id=${res.applicationId}`,
      );
    } catch (err) {
      const detail =
        err instanceof ApiError ? err.detail : err instanceof Error ? err.message : 'Erro';
      toast.error('Não foi possível enviar o cadastro', { description: detail });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-bv-5">
      <WizardStepper currentStep={step} />

      <div className="rounded-bv-lg bg-white shadow-bv-md p-bv-6 md:p-bv-7">
        {step === 1 && <Step1Empresa state={state} setField={setField} />}
        {step === 2 && <Step2Responsavel state={state} setField={setField} />}
        {step === 3 && <Step3Docs state={state} setField={setField} />}
        {step === 4 && <Step4Aceite state={state} setField={setField} />}
      </div>

      <div className="flex items-center justify-between gap-bv-3">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={handleBack}
          disabled={step === 1 || submitting}
          iconLeft={<ArrowLeft size={16} />}
        >
          Voltar
        </Button>

        {step < 4 ? (
          <Button
            type="button"
            variant="accent"
            size="md"
            onClick={handleNext}
            iconRight={<ArrowRight size={16} />}
          >
            Próximo
          </Button>
        ) : (
          <Button
            type="button"
            variant="accent"
            size="md"
            onClick={handleSubmit}
            disabled={submitting || !state.codeOfConductAccepted}
            iconRight={
              submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />
            }
          >
            {submitting ? 'Enviando…' : 'Enviar cadastro'}
          </Button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Stepper
// =============================================================================

function WizardStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center gap-bv-2" aria-label="Progresso do cadastro">
      {STEPS.map((s, i) => {
        const done = currentStep > s.id;
        const active = currentStep === s.id;
        return (
          <li key={s.id} className="flex-1 flex items-center gap-bv-2">
            <div className="flex items-center gap-bv-2 min-w-0">
              <span
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-bv-pill font-heading font-black text-body-sm shrink-0 transition-colors duration-bv-fast',
                  done && 'bg-bv-green text-white',
                  active && 'bg-bv-navy text-white',
                  !done && !active && 'bg-bv-navy-50 text-bv-navy/48',
                )}
              >
                {done ? <Check size={14} strokeWidth={3} /> : s.id}
              </span>
              <span
                className={cn(
                  'text-body-sm font-semibold truncate',
                  done && 'text-bv-green-700',
                  active && 'text-bv-navy',
                  !done && !active && 'text-bv-navy/48',
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-px',
                  done ? 'bg-bv-green' : 'bg-bv-navy/12',
                )}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// =============================================================================
// Step 1 — Empresa
// =============================================================================

interface StepProps {
  state: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function Step1Empresa({ state, setField }: StepProps) {
  return (
    <div className="space-y-bv-4">
      <h2 className="font-heading font-bold text-h3 text-bv-navy">Sobre a empresa</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-4">
        <div className="md:col-span-2 space-y-bv-1">
          <Label htmlFor="legalName" required>Razão Social</Label>
          <Input
            id="legalName"
            value={state.legalName}
            onChange={(e) => setField('legalName', e.target.value)}
            placeholder="Razão Social Ltda"
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="tradeName" required>Nome Fantasia</Label>
          <Input
            id="tradeName"
            value={state.tradeName}
            onChange={(e) => setField('tradeName', e.target.value)}
            placeholder="Nome comercial"
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="cnpj" required>CNPJ</Label>
          <Input
            id="cnpj"
            value={state.cnpj}
            onChange={(e) => setField('cnpj', maskCnpj(e.target.value))}
            placeholder="00.000.000/0000-00"
            inputMode="numeric"
          />
        </div>
        <div className="md:col-span-2 space-y-bv-1">
          <Label htmlFor="street" required>Rua / Logradouro</Label>
          <Input
            id="street"
            value={state.addressStreet}
            onChange={(e) => setField('addressStreet', e.target.value)}
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="number" required>Número</Label>
          <Input
            id="number"
            value={state.addressNumber}
            onChange={(e) => setField('addressNumber', e.target.value)}
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            value={state.addressComplement}
            onChange={(e) => setField('addressComplement', e.target.value)}
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            value={state.addressNeighborhood}
            onChange={(e) => setField('addressNeighborhood', e.target.value)}
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="zip" required>CEP</Label>
          <Input
            id="zip"
            value={state.addressZip}
            onChange={(e) => setField('addressZip', maskZip(e.target.value))}
            placeholder="00000-000"
            inputMode="numeric"
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="city" required>Cidade</Label>
          <Input
            id="city"
            value={state.addressCity}
            onChange={(e) => setField('addressCity', e.target.value)}
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="state" required>Estado</Label>
          <Select value={state.addressState} onValueChange={(v) => setField('addressState', v)}>
            <SelectTrigger id="state">
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {UFs.map((uf) => (
                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 space-y-bv-1">
          <Label htmlFor="companyPhone" required>Telefone Comercial</Label>
          <Input
            id="companyPhone"
            value={state.companyPhone}
            onChange={(e) => setField('companyPhone', maskPhone(e.target.value))}
            placeholder="(11) 0000-0000"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Step 2 — Responsável
// =============================================================================

function Step2Responsavel({ state, setField }: StepProps) {
  return (
    <div className="space-y-bv-4">
      <h2 className="font-heading font-bold text-h3 text-bv-navy">Sobre o responsável</h2>
      <p className="text-body-sm text-bv-navy/72">
        Pessoa que vai representar a empresa na plataforma. Será o primeiro administrador
        da conta.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-4">
        <div className="md:col-span-2 space-y-bv-1">
          <Label htmlFor="repName" required>Nome Completo</Label>
          <Input
            id="repName"
            value={state.representativeName}
            onChange={(e) => setField('representativeName', e.target.value)}
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="repCpf" required>CPF</Label>
          <Input
            id="repCpf"
            value={state.representativeCpf}
            onChange={(e) => setField('representativeCpf', maskCpf(e.target.value))}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="repRole" required>Cargo</Label>
          <Input
            id="repRole"
            value={state.representativeRole}
            onChange={(e) => setField('representativeRole', e.target.value)}
            placeholder="Diretor, Sócio, etc."
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="repEmail" required>E-mail</Label>
          <Input
            id="repEmail"
            type="email"
            value={state.representativeEmail}
            onChange={(e) => setField('representativeEmail', e.target.value)}
            placeholder="contato@empresa.com.br"
          />
        </div>
        <div className="space-y-bv-1">
          <Label htmlFor="repPhone" required>Telefone</Label>
          <Input
            id="repPhone"
            value={state.representativePhone}
            onChange={(e) => setField('representativePhone', maskPhone(e.target.value))}
            placeholder="(11) 99999-9999"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Step 3 — Documentos & Frota
// =============================================================================

function DocUpload({
  slot,
  label,
  current,
  onUploaded,
}: {
  slot: 'social_contract' | 'permit' | 'antt';
  label: string;
  current: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Apenas PDF é aceito.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo maior que 10MB.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadPartnerDoc(file, slot);
      onUploaded(url);
      toast.success(`${label} enviado.`);
    } catch (err) {
      toast.error('Falha no upload', {
        description: err instanceof Error ? err.message : 'Tente novamente',
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const filled = !!current;

  return (
    <div className="rounded-bv-md border border-bv-navy/12 p-bv-4 flex items-center gap-bv-3">
      <span
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-bv-sm shrink-0',
          filled ? 'bg-bv-green-50 text-bv-green-700' : 'bg-bv-navy-50 text-bv-navy/48',
        )}
      >
        {filled ? <CheckCircle2 size={20} strokeWidth={2} /> : <FileText size={20} strokeWidth={2} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold text-bv-navy">{label}</p>
        <p className="text-caption text-bv-navy/60">
          {filled ? (
            <>
              Enviado.{' '}
              <a href={current} target="_blank" rel="noopener" className="text-bv-green underline">
                ver arquivo
              </a>
            </>
          ) : (
            'PDF até 10MB'
          )}
        </p>
      </div>
      <Button
        type="button"
        variant={filled ? 'ghost' : 'outline'}
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        iconLeft={
          uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />
        }
      >
        {uploading ? 'Enviando' : filled ? 'Trocar' : 'Enviar'}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

function Step3Docs({ state, setField }: StepProps) {
  function toggleVehicleType(t: string) {
    const set = new Set(state.vehicleTypes);
    set.has(t) ? set.delete(t) : set.add(t);
    setField('vehicleTypes', Array.from(set));
  }

  function toggleRegion(uf: string) {
    const set = new Set(state.operatingRegions);
    set.has(uf) ? set.delete(uf) : set.add(uf);
    setField('operatingRegions', Array.from(set));
  }

  return (
    <div className="space-y-bv-5">
      <div>
        <h2 className="font-heading font-bold text-h3 text-bv-navy">Documentação</h2>
        <p className="text-body-sm text-bv-navy/72 mt-bv-1">
          Os 3 documentos abaixo são obrigatórios. PDF até 10MB cada.
        </p>
      </div>

      <div className="space-y-bv-3">
        <DocUpload
          slot="social_contract"
          label="Contrato Social"
          current={state.socialContractFileUrl}
          onUploaded={(url) => setField('socialContractFileUrl', url)}
        />
        <DocUpload
          slot="permit"
          label="Alvará de Funcionamento"
          current={state.permitFileUrl}
          onUploaded={(url) => setField('permitFileUrl', url)}
        />
        <DocUpload
          slot="antt"
          label="Autorização ANTT"
          current={state.anttFileUrl}
          onUploaded={(url) => setField('anttFileUrl', url)}
        />
      </div>

      <div className="space-y-bv-4 pt-bv-3 border-t border-bv-navy/8">
        <h3 className="font-heading font-bold text-h4 text-bv-navy">Sobre sua frota</h3>

        <div className="space-y-bv-1">
          <Label required>Quantidade de veículos</Label>
          <Select
            value={state.estimatedVehicleCount}
            onValueChange={(v) => setField('estimatedVehicleCount', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {FLEET_SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-bv-2">
          <Label required>Tipos de veículos</Label>
          <div className="flex flex-wrap gap-bv-3">
            {VEHICLE_TYPES.map((t) => (
              <label key={t.value} className="inline-flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={state.vehicleTypes.includes(t.value)}
                  onCheckedChange={() => toggleVehicleType(t.value)}
                />
                <span className="text-body-sm text-bv-navy">{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-bv-2">
          <Label required>Regiões de atuação (UFs)</Label>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-bv-2">
            {UFs.map((uf) => {
              const selected = state.operatingRegions.includes(uf);
              return (
                <button
                  key={uf}
                  type="button"
                  onClick={() => toggleRegion(uf)}
                  className={cn(
                    'h-9 rounded-bv-sm text-body-sm font-semibold border transition-colors duration-bv-fast',
                    selected
                      ? 'bg-bv-green text-white border-bv-green'
                      : 'bg-white text-bv-navy border-bv-navy/16 hover:border-bv-navy/40',
                  )}
                >
                  {uf}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-bv-1">
          <Label htmlFor="description">Sobre a empresa (opcional)</Label>
          <Textarea
            id="description"
            value={state.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Conte um pouco da sua experiência no setor (max 500)"
            maxLength={500}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Step 4 — Aceite
// =============================================================================

function Step4Aceite({ state, setField }: StepProps) {
  return (
    <div className="space-y-bv-4">
      <h2 className="font-heading font-bold text-h3 text-bv-navy">Aceite do código</h2>
      <p className="text-body-sm text-bv-navy/72">
        Leia com atenção e marque o aceite pra concluir o cadastro.
      </p>
      <CodeOfConductViewer
        version="1.0.0"
        accepted={state.codeOfConductAccepted}
        onAcceptedChange={(v) => setField('codeOfConductAccepted', v)}
      />
    </div>
  );
}
