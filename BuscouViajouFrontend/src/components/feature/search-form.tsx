'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { CityAutocomplete } from './city-autocomplete';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export interface SearchFormValues {
  origin: string;
  destination: string;
  date: Date | undefined;
  passengers: number;
}

interface Props {
  initialValues?: Partial<SearchFormValues>;
  /** Variante visual */
  variant?: 'hero' | 'compact';
  className?: string;
  /** Override do submit. Default: navega pra /busca?origem=...&destino=...&data=...&passageiros=... */
  onSubmit?: (values: SearchFormValues) => void;
}

/**
 * SearchForm — coração da experiência. Usado na home e no header de /busca.
 * design-dna.json + PRD §6.1
 *
 * - hero: layout grande, vertical em mobile, com CTA grande
 * - compact: usado quando já está na /busca (header sticky)
 */
export function SearchForm({ initialValues, variant = 'hero', className, onSubmit }: Props) {
  const router = useRouter();
  const [origin, setOrigin] = React.useState(initialValues?.origin ?? '');
  const [destination, setDestination] = React.useState(initialValues?.destination ?? '');
  const [date, setDate] = React.useState<Date | undefined>(initialValues?.date);
  const [passengers, setPassengers] = React.useState(initialValues?.passengers ?? 1);

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);

  const [errors, setErrors] = React.useState<Partial<Record<keyof SearchFormValues, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!origin.trim()) e.origin = 'Informe a origem.';
    if (!destination.trim()) e.destination = 'Informe o destino.';
    if (origin.trim().toLowerCase() === destination.trim().toLowerCase() && origin.trim()) {
      e.destination = 'Origem e destino devem ser diferentes.';
    }
    if (!date) e.date = 'Selecione a data.';
    if (passengers < 1) e.passengers = 'Pelo menos 1 passageiro.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const values = { origin, destination, date, passengers };
    if (onSubmit) {
      onSubmit(values);
      return;
    }
    const params = new URLSearchParams({
      origem: origin,
      destino: destination,
      data: date!.toISOString().slice(0, 10),
      passageiros: String(passengers),
    });
    router.push(`/busca?${params.toString()}`);
  }

  const layout =
    variant === 'hero'
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto] gap-bv-4'
      : 'grid-cols-2 md:grid-cols-5 gap-bv-3 items-end';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'bg-white rounded-bv-md border border-bv-navy/8 shadow-bv-md',
        variant === 'hero' ? 'p-bv-5 md:p-bv-6' : 'p-bv-4',
        className,
      )}
      aria-label="Buscar viagens"
    >
      <div className={cn('grid', layout)}>
        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="origin" required>De onde?</Label>
          <CityAutocomplete
            id="origin"
            value={origin}
            onChange={(v) => {
              setOrigin(v);
              setErrors((p) => ({ ...p, origin: undefined }));
            }}
            placeholder="Ex.: São Paulo"
            error={errors.origin}
          />
        </div>

        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="destination" required>Para onde?</Label>
          <CityAutocomplete
            id="destination"
            value={destination}
            onChange={(v) => {
              setDestination(v);
              setErrors((p) => ({ ...p, destination: undefined }));
            }}
            placeholder="Ex.: Campos do Jordão"
            error={errors.destination}
          />
        </div>

        <div className="flex flex-col gap-bv-2">
          <Label htmlFor="date" required>Quando?</Label>
          <DatePicker
            id="date"
            value={date}
            onChange={(d) => {
              setDate(d);
              setErrors((p) => ({ ...p, date: undefined }));
            }}
            placeholder="Selecionar data"
            fromDate={minDate}
            error={errors.date}
          />
        </div>

        <div className="flex flex-col gap-bv-2">
          <Label>Quantos?</Label>
          <Stepper
            value={passengers}
            onChange={setPassengers}
            min={1}
            max={60}
            unitLabel={passengers === 1 ? 'passageiro' : 'passageiros'}
            ariaLabel="passageiros"
          />
        </div>

        <div className="flex flex-col gap-bv-2 lg:justify-end">
          <span className="text-body-sm font-semibold text-bv-navy invisible select-none hidden lg:block">
            Buscar
          </span>
          <Button
            type="submit"
            variant="accent"
            size={variant === 'hero' ? 'lg' : 'md'}
            iconLeft={<Search className="h-4 w-4" />}
            fullWidth
            className="lg:w-auto"
          >
            Buscar viagens
          </Button>
        </div>
      </div>
    </form>
  );
}
