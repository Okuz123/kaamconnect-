import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBookingById } from '@/lib/data/jobs';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';
import BookingActions from '@/components/booking/BookingActions';
import PaymentButton from '@/components/booking/PaymentButton';
import Container from '@/components/ui/Container';
import { ArrowLeft, User, IndianRupee, Calendar, MapPin } from 'lucide-react';

export default async function BookingPage({ params }: { params: { id: string } }) {
  const b = await getBookingById(params.id);
  if (!b) notFound();

  const total = Number(b.total_amount || b.agreed_amount || 0);

  return (
    <Container className="py-8 md:py-10">
      <Link href="/dashboard/customer/bookings" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to bookings
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">{b.job?.title || 'Booking'}</h1>
              <div className="text-xs text-gray-400 mt-1">#{b.id.slice(0, 8)}</div>
            </div>
            <BookingStatusBadge status={b.status} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3 h-3" /> Worker
              </div>
              <div className="font-bold text-gray-900">{b.worker?.public_name || '—'}</div>
              {b.worker?.user?.phone && <div className="text-xs text-gray-500 mt-1">{b.worker.user.phone}</div>}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <IndianRupee className="w-3 h-3" /> Amount
              </div>
              <div className="font-bold text-gray-900 text-lg">₹{total.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {b.job?.description && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{b.job.description}</p>
            </div>
          )}

          {b.job?.address && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</h2>
              <p className="text-sm text-gray-700 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{b.job.address}</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <BookingActions booking={b} />
            {b.status === 'quotation_accepted' || b.status === 'awaiting_payment' ? (
              <PaymentButton booking={b} amount={total} />
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}
