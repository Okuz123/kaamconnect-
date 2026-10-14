import { Suspense } from 'react';
import NewBookingForm from '@/components/booking/NewBookingForm';
import Container from '@/components/ui/Container';

export const metadata = { title: 'New Booking — KaamConnect' };

export default function NewBookingPage() {
  return (
    <Container className="py-8 md:py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Request a Booking</h1>
        <p className="text-gray-500 text-sm mb-6">Describe the job and we'll connect you with the worker.</p>
        <Suspense fallback={<div className="text-center text-gray-500 py-12">Loading…</div>}>
          <NewBookingForm />
        </Suspense>
      </div>
    </Container>
  );
}
