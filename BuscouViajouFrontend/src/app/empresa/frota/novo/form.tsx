'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Bus,
  Check,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stepper } from '@/components/ui/stepper';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioItem } from '@/components/ui/radio';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toaster';
import { api, ApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils/cn';

const UFs = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
] as const;

const ALLOWED_IMG = ['image/jpeg', 'image/png', 'image/webp'];

interface Garage {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

interface Amenity {
  id: string;
  name: string;
  icon: string | null;
}

interface VehicleFormState {
  model: string;
  plate: string;
  vehicleType: 'BUS' | 'MINIBUS' | 'VAN';
  capacity: number;
  pricePerKm: string;
  minDepartureCost: string;
  garageId: string;
  amenityIds: string[];
  photos: { url: string; uploading: boolean }[];
}

const INITIAL: VehicleFormState = {
  model: '',
  plate: '',
  vehicleType: 'BUS',
  capacity: 44,
  pricePerKm: '',
  minDepartureCost: '',
  garageId: '',
  amenityIds: [],
  photos: [],
};

function maskPlate(v: string): string {
  return v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 7)
    .replace(/^([A-Z]{3})(\d|[A-Z])/, '$1-$2');
}

function maskZip(v: string): string {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

async function uploadVehiclePhoto(file: File): Promise<string> {
  const sign = await api<{ uploadUrl: string; publicUrl: string }>(
    '/v1/uploads/vehicle-photo',
    { method: 'POST', body: { contentType: file.type, filename: file.name } },
  );
  const putRes = await fetch(sign.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error(`Upload falhou: ${putRes.status}`);
  }
  return sign.publicUrl;
}

interface Props {
  garages: Garage[];
  amenities: Amenity[];
}

export function NewVehicleForm({ garages: initialGarages, amenities }: Props) {
  const router = useRouter();
  const [state, setState] = React.useState<VehicleFormState>(INITIAL);
  const [garages, setGarages] = React.useState(initialGarages);
  const [submitting, setSubmitting] = React.useState(false);
  const [garageDialogOpen, setGarageDialogOpen] = React.useState(false);

  // Auto-seleciona primeira garagem
  React.useEffect(() => {
    if (!state.garageId && garages.length > 0) {
      setState((s) => ({ ...s, garageId: garages[0].id }));
    }
  }, [garages, state.garageId]);

  const setField = <K extends keyof VehicleFormState>(k: K, v: VehicleFormState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  function toggleAmenity(id: string) {
    const set = new Set(state.amenityIds);
    set.has(id) ? set.delete(id) : set.add(id);
    setField('amenityIds', Array.from(set));
  }

  async function handlePhotoFiles(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files);
    if (state.photos.length + list.length > 5) {
      toast.error('Máximo de 5 fotos por veículo.');
      return;
    }
    for (const file of list) {
      if (!ALLOWED_IMG.includes(file.type)) {
        toast.error(`${file.name}: formato inválido (jpeg/png/webp).`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: maior que 5MB.`);
        continue;
      }
      const placeholder: { url: string; uploading: boolean } = {
        url: URL.createObjectURL(file),
        uploading: true,
      };
      setState((s) => ({ ...s, photos: [...s.photos, placeholder] }));
      try {
        const url = await uploadVehiclePhoto(file);
        setState((s) => ({
          ...s,
          photos: s.photos.map((p) => (p === placeholder ? { url, uploading: false } : p)),
        }));
      } catch (err) {
        toast.error(`Falha no upload`, {
          description: err instanceof Error ? err.message : 'Tente novamente',
        });
        setState((s) => ({ ...s, photos: s.photos.filter((p) => p !== placeholder) }));
      }
    }
  }

  function removePhoto(idx: number) {
    setState((s) => ({ ...s, photos: s.photos.filter((_, i) => i !== idx) }));
  }

  function validate(): string | null {
    if (state.model.trim().length < 2) return 'Informe o modelo do veículo.';
    if (!/^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/.test(state.plate.replace('-', ''))) {
      return 'Placa inválida (formato AAA-1234 ou Mercosul AAA-1A23).';
    }
    if (state.capacity < 1) return 'Capacidade mínima 1 passageiro.';
    const ppk = Number(state.pricePerKm.replace(',', '.'));
    const min = Number(state.minDepartureCost.replace(',', '.'));
    if (!ppk || ppk <= 0) return 'Preço por km inválido.';
    if (!min || min <= 0) return 'Custo mínimo de saída inválido.';
    if (!state.garageId) return 'Selecione ou cadastre uma garagem.';
    if (state.photos.some((p) => p.uploading)) return 'Aguarde os uploads terminarem.';
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      const created = await api<{ id: string }>('/v1/company/me/vehicles', {
        method: 'POST',
        body: {
          garageId: state.garageId,
          plate: state.plate.replace('-', ''),
          model: state.model.trim(),
          vehicleType: state.vehicleType,
          capacity: state.capacity,
          pricePerKm: Number(state.pricePerKm.replace(',', '.')),
          minDepartureCost: Number(state.minDepartureCost.replace(',', '.')),
          dynamicPricingEnabled: true,
          status: 'ACTIVE',
          amenityIds: state.amenityIds,
          photoUrls: state.photos.filter((p) => !p.uploading).map((p) => p.url),
        },
      });
      toast.success('Veículo cadastrado!', {
        description: 'Já está disponível nas buscas.',
      });
      router.push('/empresa');
      router.refresh();
    } catch (e) {
      const detail =
        e instanceof ApiError ? e.detail : e instanceof Error ? e.message : 'Erro';
      toast.error('Falha ao cadastrar', { description: detail });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="space-y-bv-5">
        <Section title="Identificação">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-4">
            <div className="md:col-span-2 space-y-bv-1">
              <Label htmlFor="model" required>Modelo</Label>
              <Input
                id="model"
                value={state.model}
                onChange={(e) => setField('model', e.target.value)}
                placeholder="Ex: Marcopolo Paradiso G8 1800 DD"
              />
            </div>
            <div className="space-y-bv-1">
              <Label htmlFor="plate" required>Placa</Label>
              <Input
                id="plate"
                value={state.plate}
                onChange={(e) => setField('plate', maskPlate(e.target.value))}
                placeholder="ABC-1234"
                inputMode="text"
              />
            </div>
            <div className="space-y-bv-1">
              <Label required>Capacidade</Label>
              <Stepper
                value={state.capacity}
                onChange={(v) => setField('capacity', v)}
                min={1}
                max={80}
                unitLabel="passageiros"
              />
            </div>
            <div className="md:col-span-2 space-y-bv-2">
              <Label required>Tipo de veículo</Label>
              <RadioGroup
                value={state.vehicleType}
                onValueChange={(v) => setField('vehicleType', v as any)}
                className="flex flex-wrap gap-bv-3"
              >
                {[
                  { v: 'BUS', label: 'Ônibus' },
                  { v: 'MINIBUS', label: 'Micro-ônibus' },
                  { v: 'VAN', label: 'Van' },
                ].map((t) => (
                  <label
                    key={t.v}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-bv-md border px-bv-4 py-bv-2 cursor-pointer transition-colors',
                      state.vehicleType === t.v
                        ? 'border-bv-green bg-bv-green-50'
                        : 'border-bv-navy/16 bg-white',
                    )}
                  >
                    <RadioItem value={t.v} />
                    <span className="text-body-sm font-semibold text-bv-navy">{t.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>
        </Section>

        <Section title="Preço">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bv-4">
            <div className="space-y-bv-1">
              <Label htmlFor="ppk" required>Preço por km (R$)</Label>
              <Input
                id="ppk"
                value={state.pricePerKm}
                onChange={(e) => setField('pricePerKm', e.target.value)}
                placeholder="3,50"
                inputMode="decimal"
              />
              <p className="text-caption text-bv-navy/60">
                Multiplicado por 2x (ida + retorno) na cotação.
              </p>
            </div>
            <div className="space-y-bv-1">
              <Label htmlFor="min" required>Custo mínimo de saída (R$)</Label>
              <Input
                id="min"
                value={state.minDepartureCost}
                onChange={(e) => setField('minDepartureCost', e.target.value)}
                placeholder="800,00"
                inputMode="decimal"
              />
              <p className="text-caption text-bv-navy/60">
                Cobrado quando a viagem for mais curta que o mínimo.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Comodidades">
          {amenities.length === 0 ? (
            <p className="text-body-sm text-bv-navy/60 italic">
              Nenhuma comodidade cadastrada no catálogo.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-bv-2">
              {amenities.map((a) => (
                <label
                  key={a.id}
                  className="inline-flex items-center gap-2 cursor-pointer rounded-bv-sm border border-bv-navy/12 px-bv-3 py-bv-2 hover:border-bv-navy/24"
                >
                  <Checkbox
                    checked={state.amenityIds.includes(a.id)}
                    onCheckedChange={() => toggleAmenity(a.id)}
                  />
                  <span className="text-body-sm text-bv-navy">{a.name}</span>
                </label>
              ))}
            </div>
          )}
        </Section>

        <Section title="Garagem">
          <div className="flex items-end gap-bv-3 flex-wrap">
            <div className="flex-1 min-w-[200px] space-y-bv-1">
              <Label required>Garagem do veículo</Label>
              <Select
                value={state.garageId}
                onValueChange={(v) => setField('garageId', v)}
                disabled={garages.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      garages.length === 0 ? 'Cadastre uma garagem' : 'Selecione'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {garages.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                      {g.city && g.state && ` · ${g.city}, ${g.state}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setGarageDialogOpen(true)}
              iconLeft={<Plus size={16} />}
            >
              Nova garagem
            </Button>
          </div>
        </Section>

        <Section title="Fotos">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-bv-3">
            {state.photos.map((p, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-bv-sm overflow-hidden bg-bv-navy-50 border border-bv-navy/12"
              >
                <img
                  src={p.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {p.uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-bv-pill bg-black/60 text-white flex items-center justify-center hover:bg-black"
                  aria-label="Remover foto"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
            {state.photos.length < 5 && (
              <label
                className={cn(
                  'aspect-square rounded-bv-sm border-2 border-dashed border-bv-navy/24 cursor-pointer',
                  'flex flex-col items-center justify-center gap-1 text-bv-navy/60 hover:border-bv-green hover:text-bv-green',
                )}
              >
                <ImagePlus size={20} />
                <span className="text-caption font-semibold">Adicionar</span>
                <input
                  type="file"
                  accept={ALLOWED_IMG.join(',')}
                  multiple
                  className="hidden"
                  onChange={(e) => handlePhotoFiles(e.target.files)}
                />
              </label>
            )}
          </div>
          <p className="text-caption text-bv-navy/60 mt-bv-2">
            Até 5 fotos. JPEG, PNG ou WebP. Máx 5MB cada. A primeira é a foto principal.
          </p>
        </Section>

        <div className="flex justify-end gap-bv-3 pt-bv-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => router.push('/empresa')}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            variant="accent"
            size="md"
            onClick={handleSubmit}
            disabled={submitting}
            iconRight={
              submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />
            }
          >
            {submitting ? 'Cadastrando…' : 'Cadastrar veículo'}
          </Button>
        </div>
      </div>

      <NewGarageDialog
        open={garageDialogOpen}
        onClose={() => setGarageDialogOpen(false)}
        onCreated={(g) => {
          setGarages((list) => [...list, g]);
          setField('garageId', g.id);
          setGarageDialogOpen(false);
        }}
      />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-5 space-y-bv-3">
      <h3 className="font-heading font-bold text-h4 text-bv-navy">{title}</h3>
      {children}
    </section>
  );
}

// =============================================================================
// Modal de criação de garagem
// =============================================================================

interface GarageDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (g: Garage) => void;
}

function NewGarageDialog({ open, onClose, onCreated }: GarageDialogProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [data, setData] = React.useState({
    name: '',
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
  });

  React.useEffect(() => {
    if (!open) {
      setData({ name: '', street: '', number: '', city: '', state: '', zipCode: '' });
    }
  }, [open]);

  async function handleCreate() {
    if (
      data.name.length < 2 ||
      data.street.length < 2 ||
      !data.number ||
      !data.city ||
      !/^[A-Z]{2}$/.test(data.state) ||
      data.zipCode.length < 9
    ) {
      toast.error('Preencha todos os campos da garagem.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await api<Garage>('/v1/company/me/garages', {
        method: 'POST',
        body: data,
      });
      toast.success('Garagem cadastrada!');
      onCreated(created);
    } catch (e) {
      toast.error('Falha', {
        description: e instanceof ApiError ? e.detail : 'Erro inesperado',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Nova garagem</DialogTitle>
          <DialogDescription>
            Endereço onde o veículo fica estacionado quando não está em viagem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-bv-3">
          <div className="space-y-bv-1">
            <Label htmlFor="g-name" required>Nome / apelido</Label>
            <Input
              id="g-name"
              value={data.name}
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              placeholder="Garagem Central"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-bv-3">
            <div className="space-y-bv-1">
              <Label htmlFor="g-street" required>Rua</Label>
              <Input
                id="g-street"
                value={data.street}
                onChange={(e) => setData((d) => ({ ...d, street: e.target.value }))}
              />
            </div>
            <div className="space-y-bv-1">
              <Label htmlFor="g-num" required>Número</Label>
              <Input
                id="g-num"
                value={data.number}
                onChange={(e) => setData((d) => ({ ...d, number: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px] gap-bv-3">
            <div className="space-y-bv-1">
              <Label htmlFor="g-city" required>Cidade</Label>
              <Input
                id="g-city"
                value={data.city}
                onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
              />
            </div>
            <div className="space-y-bv-1">
              <Label required>UF</Label>
              <Select
                value={data.state}
                onValueChange={(v) => setData((d) => ({ ...d, state: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {UFs.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-bv-1">
              <Label htmlFor="g-zip" required>CEP</Label>
              <Input
                id="g-zip"
                value={data.zipCode}
                onChange={(e) =>
                  setData((d) => ({ ...d, zipCode: maskZip(e.target.value) }))
                }
                placeholder="00000-000"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="accent"
            onClick={handleCreate}
            disabled={submitting}
            iconRight={
              submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />
            }
          >
            {submitting ? 'Salvando…' : 'Salvar garagem'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
