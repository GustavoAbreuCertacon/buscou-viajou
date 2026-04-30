import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookingDetail } from './booking-detail';
import { serverApi } from '@/lib/api/server';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { ApiError } from '@/lib/api/client';

export const dynamic = 'force-dynamic';

interface ApiBookingDetail {
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

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let booking: ApiBookingDetail;
  try {
    booking = await serverApi<ApiBookingDetail>(`/v1/bookings/${id}`);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }

  const user = await getCurrentUser();
  const userMeta = user ? { firstName: user.firstName } : null;

  return (
    <>
      <Navbar user={userMeta} />
      <main id="main" className="bg-bv-bg min-h-[60vh]">
        <div className="container mx-auto max-w-bv-container px-bv-5 py-bv-6">
          <Link
            href="/minhas-viagens"
            className="inline-flex items-center gap-1 text-body-sm font-medium text-bv-navy/72 hover:text-bv-navy mb-bv-4"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Voltar pras minhas solicitações
          </Link>

          {/* Disclaimer do modelo de negócio */}
          <aside
            role="note"
            className="mb-bv-5 flex items-start gap-bv-3 rounded-bv-md border border-bv-navy/12 bg-bv-navy-50/40 p-bv-4"
          >
            <Info size={18} strokeWidth={2.5} className="text-bv-navy shrink-0 mt-0.5" aria-hidden />
            <div className="text-body-sm text-bv-navy/80 leading-relaxed">
              <strong className="text-bv-navy">Status da sua solicitação.</strong>{' '}
              A finalização da reserva, pagamento e operação da viagem acontece
              direto com a empresa parceira — a Buscou Viajou faz a ponte.
              Em caso de dúvidas, fale com o suporte da empresa.
            </div>
          </aside>

          <BookingDetail booking={booking} />
        </div>
      </main>
      <Footer />
    </>
  );
}
