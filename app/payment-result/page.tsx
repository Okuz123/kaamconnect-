import Link from 'next/link';

export default function PaymentResultPage({ searchParams }: { searchParams: { status?: string } }) {
  const ok = searchParams.status === 'success';
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className={'w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ' + (ok ? 'bg-green-100' : 'bg-red-100')}>
        {ok ? '✅' : '⚠️'}
      </div>
      <h1 className="text-xl font-bold mb-2">{ok ? 'Payment successful' : 'Payment not completed'}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {ok ? 'Your booking is confirmed. The worker has been notified.' : 'If money was deducted, it will be refunded within 5-7 working days.'}
      </p>
      <Link href="/dashboard/customer/bookings" className="inline-block bg-brand-600 text-white px-5 py-2.5 rounded-lg">Go to my bookings</Link>
    </div>
  );
}
