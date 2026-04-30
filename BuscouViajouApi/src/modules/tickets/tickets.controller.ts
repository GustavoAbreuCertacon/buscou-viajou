import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as QRCode from 'qrcode';
import { createHmac, randomUUID } from 'crypto';
import { SupabaseService } from '../../database/supabase.service';
import { CurrentUser } from '../../auth/decorators';
import { SupabaseJwtPayload } from '../../auth/jwks.service';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller({ path: 'bookings/:bookingId/ticket', version: '1' })
export class TicketsController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna o bilhete digital com QR Code da reserva' })
  async getTicket(
    @Param('bookingId') bookingId: string,
    @CurrentUser() user: SupabaseJwtPayload,
  ) {
    // Verifica reserva
    const { data: booking, error: bErr } = await this.supabase.admin
      .from('bookings')
      .select(
        `
        id, booking_code, client_id, status, departure_date, passengers,
        origin_address, destination_address, total_price,
        vehicle:vehicles ( model, vehicle_type ),
        company:companies ( name, logo_url ),
        driver:drivers ( first_name, last_name, phone, photo_url ),
        client:profiles!client_id ( first_name, last_name )
      `,
      )
      .eq('id', bookingId)
      .maybeSingle();

    if (bErr) throw bErr;
    if (!booking) throw new NotFoundException('Reserva não encontrada');
    if (booking.client_id !== user.sub) throw new ForbiddenException('Acesso negado');

    if (!['CONFIRMED', 'IN_PROGRESS', 'PENDING_COMPLETION', 'COMPLETED'].includes(booking.status)) {
      throw new BadRequestException(
        `Bilhete só disponível após confirmação do pagamento (status atual: ${booking.status})`,
      );
    }

    // Pega ou cria ticket
    let { data: ticket } = await this.supabase.admin
      .from('tickets')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (!ticket) {
      const ticketCode = booking.booking_code ?? `BV-${new Date().getFullYear()}-${randomUUID().slice(0, 4).toUpperCase()}`;
      const payload = JSON.stringify({ b: bookingId, c: ticketCode, v: 1 });
      const hash = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'secret').update(payload).digest('hex');
      const qrPayload = `${payload}.${hash.slice(0, 16)}`;

      const { data: created, error: tErr } = await this.supabase.admin
        .from('tickets')
        .insert({
          booking_id: bookingId,
          ticket_code: ticketCode,
          qr_payload: qrPayload,
          qr_hash: hash,
          status: 'VALID',
        })
        .select('*')
        .single();
      if (tErr) throw tErr;
      ticket = created;
    }

    const qrSvg = await QRCode.toString(ticket.qr_payload, { type: 'svg', errorCorrectionLevel: 'M', margin: 1 });
    const qrPng = await QRCode.toDataURL(ticket.qr_payload, { errorCorrectionLevel: 'M', margin: 1 });

    return {
      ticket_code: ticket.ticket_code,
      status: ticket.status,
      qr_svg: qrSvg,
      qr_png_base64: qrPng,
      booking: {
        id: booking.id,
        status: booking.status,
        passengers: booking.passengers,
        departure_date: booking.departure_date,
        origin: booking.origin_address,
        destination: booking.destination_address,
        total_price: booking.total_price,
      },
      vehicle: booking.vehicle,
      company: booking.company,
      driver: booking.driver,
      client: booking.client
        ? {
            first_name: (booking.client as any).first_name,
            last_name: (booking.client as any).last_name,
          }
        : null,
    };
  }
}
