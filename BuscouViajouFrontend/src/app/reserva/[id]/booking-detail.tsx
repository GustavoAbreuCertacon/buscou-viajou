'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles, AlertTriangle, Ban } from 'lucide-react';
import { api, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { BicolorHeading } from '@/components/ui/bicolor-heading';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TicketViewer } from '@/components/feature/ticket-viewer';
import { BookingStatusBadge } from '@/components/feature/booking-status-badge';
import { toast } from '@/components/ui/toaster';
import { formatCurrency, formatDateLong, formatTime } from '@/lib/utils/format';
import type { BookingStatus } from '@/lib/api/types';

interface BookingProp {
  id: string;
  booking_code: string | null;
  status: string;
  passengers: number;
  total_price: number;
  base_price: number;
  dynamic_multiplier: number;
  departure_date: string;
  origin_address: string;
  destination_address: string;
  vehicle?: { model: string; vehicle_type: string };
  company?: { name: string; logo_url: string | null };
  driver?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    photo_url: string | null;
  } | null;
  client?: { first_name: string; last_name: string };
  ticket?: { ticket_code: string; status: string } | null;
}

export function BookingDetail({ booking: initial }: { booking: BookingProp }) {
  const queryClient = useQueryClient();

  const { data: booking } = useQuery<BookingProp>({
    queryKey: ['booking', initial.id],
    queryFn: () => api<BookingProp>(`/v1/bookings/${initial.id}`),
    initialData: initial,
    staleTime: 10_000,
  });

  const status = booking.status as BookingStatus;

  const isPostConfirmed = ['CONFIRMED', 'IN_PROGRESS', 'PENDING_COMPLETION', 'COMPLETED'].includes(
    status,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-bv-6 max-w-6xl mx-auto">
      <div className="space-y-bv-5 min-w-0">
        <header className="space-y-bv-3">
          <p className="text-caption font-bold text-bv-navy/72 uppercase tracking-wider">
            {booking.booking_code ?? booking.id.slice(0, 8)}
          </p>
          <BicolorHeading as="h1" size="h1">
            {cleanAddr(booking.origin_address)}{' '}
            <span className="text-bv-green">→</span>{' '}
            {cleanAddr(booking.destination_address)}
          </BicolorHeading>
          <div className="flex items-center gap-bv-3 flex-wrap">
            <BookingStatusBadge status={status} size="md" />
            <p className="text-body-sm text-bv-navy/72">
              {formatDateLong(booking.departure_date)} · {formatTime(booking.departure_date)}
            </p>
          </div>
        </header>

        {/* Card de status contextual */}
        <StatusCard booking={booking} />

        {/* Bilhete */}
        {isPostConfirmed && <TicketBlock bookingId={booking.id} booking={booking} />}

        {/* Resumo da viagem */}
        <section className="rounded-bv-md bg-white border border-bv-navy/12 p-bv-5 space-y-bv-3">
          <h2 className="font-heading font-bold text-h4 text-bv-navy">Resumo</h2>
          <dl className="grid grid-cols-2 gap-bv-3 text-body-sm">
            <Field label="Veículo" value={booking.vehicle?.model ?? '—'} />
            <Field label="Empresa" value={booking.company?.name ?? '—'} />
            <Field label="Passageiros" value={String(booking.passengers)} />
            <Field
              label="Multiplicador"
              value={booking.dynamic_multiplier === 1 ? 'Padrão' : `${booking.dynamic_multiplier}x`}
            />
          </dl>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start space-y-bv-4">
        <div className="rounded-bv-lg bg-white border border-bv-navy/12 shadow-bv-md p-bv-5">
          <p className="text-caption font-semibold text-bv-navy/72 uppercase tracking-wider">
            Total
          </p>
          <p className="font-heading font-black text-h1 text-bv-navy tabular-nums leading-none mt-bv-1">
            {formatCurrency(booking.total_price)}
          </p>
          <p className="mt-bv-1 text-body-sm text-bv-navy/72">
            {booking.passengers === 1 ? '1 passageiro' : `${booking.passengers} passageiros`}
          </p>

          <div className="mt-bv-4 space-y-bv-2">
            {status === 'PENDING_APPROVAL' && (
              <DemoApproveButton bookingId={booking.id} />
            )}

            {(['CONFIRMED', 'PENDING_APPROVAL', 'PENDING_PAYMENT'] as BookingStatus[]).includes(status) && (
              <CancelButton booking={booking} />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption text-bv-navy/72 uppercase tracking-wide">{label}</dt>
      <dd className="text-body font-medium text-bv-navy mt-1">{value}</dd>
    </div>
  );
}

function StatusCard({ booking }: { booking: BookingProp }) {
  const status = booking.status as BookingStatus;
  let title = '';
  let body = '';
  let tone: 'warning' | 'success' | 'danger' | 'info' = 'info';

  switch (status) {
    case 'PENDING_APPROVAL':
      title = 'Aguardando aprovação da empresa';
      body = 'Geralmente leva até 24 horas. Você será notificado quando houver atualização.';
      tone = 'warning';
      break;
    case 'PENDING_PAYMENT':
      title = 'Pagamento pendente';
      body = 'Sua reserva foi aprovada. Conclua o pagamento pra confirmar a viagem.';
      tone = 'warning';
      break;
    case 'CONFIRMED':
      title = 'Viagem confirmada';
      body = 'Tudo pronto. No dia, mostre o bilhete pro motorista.';
      tone = 'success';
      break;
    case 'COMPLETED':
      title = 'Viagem concluída';
      body = 'Como foi a experiência? Sua avaliação ajuda outros viajantes.';
      tone = 'success';
      break;
    case 'CANCELLED_BY_CLIENT':
      title = 'Reserva cancelada';
      body = 'Você cancelou esta reserva.';
      tone = 'info';
      break;
    case 'CANCELLED_BY_COMPANY':
      title = 'Cancelada pela empresa';
      body = 'A empresa cancelou esta viagem. Você foi totalmente reembolsado.';
      tone = 'danger';
      break;
    default:
      return null;
  }

  const colors = {
    warning: 'bg-[#FFF4E0] border-[#E0A23B]/30 text-[#A06D1F]',
    success: 'bg-bv-green-50 border-bv-green/30 text-bv-green-700',
    danger: 'bg-[#FCE8E8] border-bv-danger/30 text-[#9C2C2C]',
    info: 'bg-bv-navy-50 border-bv-navy/16 text-bv-navy',
  }[tone];

  return (
    <div className={`rounded-bv-md border p-bv-4 ${colors}`}>
      <p className="font-semibold text-body">{title}</p>
      <p className="mt-1 text-body-sm">{body}</p>
    </div>
  );
}

function DemoApproveButton({ bookingId }: { bookingId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      api(`/v1/bookings/${bookingId}/_demo/approve-and-pay`, { method: 'POST' }),
    onSuccess: () => {
      toast.success('Reserva confirmada!', {
        description: 'Aprovação e pagamento simulados. Seu bilhete já está disponível.',
      });
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
    },
    onError: (e) => {
      const msg = e instanceof ApiError ? e.detail : 'Tente em instantes.';
      toast.error('Não foi possível aprovar', { description: msg });
    },
  });

  return (
    <Button
      variant="accent"
      size="lg"
      fullWidth
      iconLeft={<Sparkles className="h-4 w-4" />}
      loading={mutation.isPending}
      loadingText="Processando…"
      onClick={() => mutation.mutate()}
    >
      Simular aprovação + pagamento
    </Button>
  );
}

function CancelButton({ booking }: { booking: BookingProp }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState('');

  const mutation = useMutation({
    mutationFn: () =>
      api<{ refund_percentage: number; refund_amount: number; message: string }>(
        `/v1/bookings/${booking.id}/cancel`,
        { method: 'POST', body: { reason } },
      ),
    onSuccess: (data) => {
      toast.success(`Reserva cancelada (${data.refund_percentage}% reembolso)`, {
        description: data.message,
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['booking', booking.id] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (e) => {
      const msg = e instanceof ApiError ? e.detail : 'Tente em instantes.';
      toast.error('Não foi possível cancelar', { description: msg });
    },
  });

  const hoursToTrip = Math.max(
    0,
    (new Date(booking.departure_date).getTime() - Date.now()) / 3_600_000,
  );
  const refundPct = hoursToTrip >= 72 ? 100 : hoursToTrip >= 24 ? 50 : 0;
  const refundAmount = (Number(booking.total_price) * refundPct) / 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" fullWidth>
          Cancelar reserva
        </Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Cancelar esta reserva?</DialogTitle>
          <DialogDescription>
            {refundPct === 100 && (
              <>Como faltam mais de 72h pra viagem, você receberá <strong>100% de reembolso</strong>.</>
            )}
            {refundPct === 50 && (
              <>Faltam entre 24h e 72h pra viagem. Reembolso de <strong>50%</strong> ({formatCurrency(refundAmount)}).</>
            )}
            {refundPct === 0 && (
              <>Faltam menos de 24h. Cancelamentos nesse prazo <strong>não têm reembolso</strong>.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-bv-2">
          <Label htmlFor="reason">Motivo (opcional)</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex.: Mudei a data da viagem..."
            maxLength={500}
            showCounter
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Voltar
          </Button>
          <Button
            variant="danger"
            iconLeft={<Ban className="h-4 w-4" />}
            loading={mutation.isPending}
            loadingText="Cancelando…"
            onClick={() => mutation.mutate()}
          >
            Confirmar cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TicketBlock({ bookingId, booking }: { bookingId: string; booking: BookingProp }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ticket', bookingId],
    queryFn: () =>
      api<{
        ticket_code: string;
        status: string;
        qr_svg: string;
        qr_png_base64: string;
        booking: any;
        vehicle: any;
        company: any;
        driver: any;
        client: any;
      }>(`/v1/bookings/${bookingId}/ticket`),
    staleTime: Infinity,
  });

  if (isLoading) return <Skeleton className="h-[420px]" />;
  if (!data) return null;

  return (
    <TicketViewer
      ticketCode={data.ticket_code}
      qrSvg={data.qr_svg}
      qrPngBase64={data.qr_png_base64}
      status={data.status as 'VALID' | 'USED' | 'INVALIDATED'}
      booking={{
        status: data.booking.status,
        passengers: data.booking.passengers,
        departureDate: data.booking.departure_date,
        origin: data.booking.origin,
        destination: data.booking.destination,
        totalPrice: data.booking.total_price,
      }}
      vehicle={data.vehicle}
      company={data.company}
      driver={
        data.driver
          ? {
              firstName: data.driver.first_name,
              lastName: data.driver.last_name,
              phone: data.driver.phone,
              photoUrl: data.driver.photo_url,
            }
          : null
      }
      client={
        data.client
          ? { firstName: data.client.first_name, lastName: data.client.last_name }
          : null
      }
    />
  );
}

function cleanAddr(addr: string): string {
  return addr.split(',').slice(0, 2).join(', ').trim();
}
