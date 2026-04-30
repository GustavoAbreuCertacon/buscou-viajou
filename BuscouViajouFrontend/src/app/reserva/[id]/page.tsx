import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
            Voltar pras minhas viagens
          </Link>

          <BookingDetail booking={booking} />
        </div>
      </main>
      <Footer />
    </>
  );
}
