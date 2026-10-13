import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBookingById } from '@/lib/data/jobs';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';
import BookingActions from '@/components/booking/BookingActions';
import PaymentButton from '@/components/booking/PaymentButton';

export default async function BookingPage({ params }: { params: { id: string } }) {
  const b = await getBookingById(params.id);
  if (!b) notFound();

  const total = Number(b.total_amount || b.agreed_amount || 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/dashboard/customer/bookings" className="text-sm text-brand-600 hover:underline mb-4 inline-block">← Back to bookings</Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold">{b.job?.title || 'Booking'}</h1>
            <div className="text-sm text-gray-500">#{b.id.slice(0, 8)}</div>
          </div>
          <BookingStatusBadge status={b.status} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500">Worker</div>
            <div className="font-medium">{b.worker?.public_name || '—'}</div>
            {b.worker?.user?.phone && <div className="text-xs text-gray-500 mt-1">{b.worker.user.phone}</div>}
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500">Amount</div>
            <div className="font-medium">₹{total.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {b.job?.description && (
          <>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h2>
            <p className="text-sm text-gray-700 mb-6">{b.job.description}</p>
          </>
        )}

        <div className="border-t border-gray-100 pt-6">
          <BookingActions booking={b} />
          {b.status === 'quotation_accepted' || b.status === 'awaiting_payment' ? (
            <PaymentButton booking={b} amount={total} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
