'use client';

import * as React from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Users, Phone, Bus, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { formatDateTime, formatRelativeDay } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface TicketBooking {
  status: string;
  passengers: number;
  departureDate: string;
  origin: string;
  destination: string;
  totalPrice: number;
}

interface TicketVehicle {
  model?: string | null;
  vehicleType?: string | null;
}

interface TicketCompany {
  name?: string | null;
  logoUrl?: string | null;
}

interface TicketDriver {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
}

interface TicketClient {
  firstName?: string | null;
  lastName?: string | null;
}

export interface TicketViewerProps {
  ticketCode: string;
  /** SVG inline retornado pelo backend */
  qrSvg?: string | null;
  /** Data URI base64 PNG (fallback se SVG não rolar) */
  qrPngBase64?: string | null;
  status: 'VALID' | 'USED' | 'INVALIDATED' | string;
  booking: TicketBooking;
  vehicle?: TicketVehicle | null;
  company?: TicketCompany | null;
  driver?: TicketDriver | null;
  client?: TicketClient | null;
  className?: string;
}

/**
 * TicketViewer — bilhete digital com QR Code (PRD §6.8).
 *
 * Layout estilo "boarding pass" elegante:
 *  - Header verde com logo + status
 *  - Body: QR + dados da viagem
 *  - Footer: motorista, contato, ações (compartilhar, baixar PDF)
 */
export function TicketViewer({
  ticketCode,
  qrSvg,
  qrPngBase64,
  status,
  booking,
  vehicle,
  company,
  driver,
  client,
  className,
}: TicketViewerProps) {
  const isValid = status === 'VALID';
  const isUsed = status === 'USED';
  const driverName = [driver?.firstName, driver?.lastName].filter(Boolean).join(' ');
  const clientName = [client?.firstName, client?.lastName].filter(Boolean).join(' ');

  return (
    <article
      className={cn(
        'relative max-w-2xl mx-auto',
        'rounded-bv-lg bg-white shadow-bv-lg overflow-hidden',
        className,
      )}
      aria-label="Bilhete digital"
    >
      {/* Header navy com logo + status */}
      <div className="bg-bv-navy text-white px-bv-6 py-bv-5 flex items-center justify-between gap-bv-3">
        <Logo variant="white" height={28} />
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-bv-pill px-bv-3 py-1 text-caption font-bold uppercase tracking-wide',
            isValid && 'bg-bv-green text-white',
            isUsed && 'bg-bv-warning/90 text-bv-navy',
            !isValid && !isUsed && 'bg-white/20 text-white',
          )}
        >
          {isValid && '● Válido'}
          {isUsed && '● Utilizado'}
          {!isValid && !isUsed && status}
        </span>
      </div>

      {/* Body: QR + dados */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-bv-6 p-bv-6">
        {/* QR */}
        <div className="flex flex-col items-center gap-bv-3">
          <div className="w-48 h-48 rounded-bv-md bg-white border-bv-base border-bv-navy/12 p-bv-3 flex items-center justify-center">
            {qrSvg ? (
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : qrPngBase64 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrPngBase64} alt={`QR Code ${ticketCode}`} className="w-full h-full" />
            ) : (
              <div className="text-bv-navy/48 text-caption text-center">QR indisponível</div>
            )}
          </div>
          <p className="text-caption font-bold text-bv-navy tabular-nums tracking-wider">
            {ticketCode}
          </p>
          {!isValid && (
            <p className="text-caption text-bv-navy/72 italic text-center max-w-[12rem]">
              {isUsed
                ? 'Este bilhete já foi utilizado.'
                : 'Bilhete inválido.'}
            </p>
          )}
        </div>

        {/* Dados da viagem */}
        <div className="flex flex-col gap-bv-4 min-w-0">
          {clientName && (
            <div>
              <p className="text-caption text-bv-navy/72 uppercase tracking-wide">Passageiro</p>
              <p className="text-h4 font-heading font-bold text-bv-navy mt-1">{clientName}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-bv-3">
            <Field icon={MapPin} label="De">
              {cleanAddr(booking.origin)}
            </Field>
            <Field icon={MapPin} label="Para">
              {cleanAddr(booking.destination)}
            </Field>
            <Field icon={Calendar} label="Embarque" colSpan>
              <span className="font-bold">{formatDateTime(booking.departureDate)}</span>
              <span className="ml-bv-2 text-body-sm text-bv-navy/72">
                ({formatRelativeDay(booking.departureDate)})
              </span>
            </Field>
            <Field icon={Users} label="Passageiros" colSpan>
              {booking.passengers}
            </Field>
          </div>

          {(company?.name || vehicle?.model) && (
            <div className="rounded-bv-sm bg-bv-navy-50 px-bv-3 py-bv-3">
              <p className="text-caption text-bv-navy/72 uppercase tracking-wide">Veículo</p>
              <p className="font-semibold text-bv-navy mt-1 inline-flex items-center gap-bv-2">
                <Bus size={16} className="text-bv-navy/72" strokeWidth={2} />
                {vehicle?.model ?? 'Veículo'}
              </p>
              {company?.name && (
                <p className="text-body-sm text-bv-navy/72 mt-1">{company.name}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer com motorista */}
      {(driverName || driver?.phone) && (
        <div className="border-t border-dashed border-bv-navy/16 px-bv-6 py-bv-4 bg-bv-bg flex items-center justify-between gap-bv-4">
          <div className="flex items-center gap-bv-3 min-w-0">
            <span className="h-12 w-12 rounded-full bg-bv-navy text-white flex items-center justify-center font-bold uppercase shrink-0 overflow-hidden">
              {driver?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={driver.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                driverName[0] ?? 'M'
              )}
            </span>
            <div className="min-w-0">
              <p className="text-caption text-bv-navy/72 uppercase tracking-wide">Motorista</p>
              <p className="font-semibold text-bv-navy truncate">{driverName}</p>
              {driver?.phone && (
                <a
                  href={`tel:${driver.phone}`}
                  className="text-body-sm text-bv-green hover:underline inline-flex items-center gap-1"
                >
                  <Phone size={12} strokeWidth={2.5} />
                  {driver.phone}
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-bv-2 shrink-0">
            <Button variant="ghost" size="icon" aria-label="Compartilhar">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" iconLeft={<Download className="h-4 w-4" />}>
              PDF
            </Button>
          </div>
        </div>
      )}

      {/* Notch decorativo nas laterais */}
      <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-bv-bg" aria-hidden />
      <span className="absolute right-[-12px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-bv-bg" aria-hidden />
    </article>
  );
}

function Field({
  icon: Icon,
  label,
  children,
  colSpan,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
  colSpan?: boolean;
}) {
  return (
    <div className={cn('min-w-0', colSpan && 'col-span-2')}>
      <p className="text-caption text-bv-navy/72 uppercase tracking-wide flex items-center gap-1">
        <Icon size={11} strokeWidth={2.5} />
        {label}
      </p>
      <p className="text-body text-bv-navy mt-1 truncate">{children}</p>
    </div>
  );
}

function cleanAddr(addr: string): string {
  const parts = addr.split(',').map((s) => s.trim());
  return parts.slice(0, 2).join(', ');
}
