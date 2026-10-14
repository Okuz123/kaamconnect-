import Link from 'next/link';
import Container from '@/components/ui/Container';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function PaymentResultPage({ searchParams }: { searchParams: { status?: string } }) {
  const ok = searchParams.status === 'success';
  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto text-center">
        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 ${ok ? 'bg-success-50' : 'bg-amber-50'}`}>
          {ok ? <CheckCircle2 className="w-10 h-10 text-success-600" /> : <XCircle className="w-10 h-10 text-amber-600" />}
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          {ok ? 'Payment successful' : 'Payment not completed'}
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          {ok
            ? 'Your booking is confirmed. The worker has been notified.'
            : 'If money was deducted, it will be refunded within 5–7 working days.'}
        </p>
        <Link href="/dashboard/customer/bookings" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm">
          Go to my bookings <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Container>
  );
}
