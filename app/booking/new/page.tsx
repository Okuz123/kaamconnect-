import { Suspense } from 'react';
import NewBookingForm from '@/components/booking/NewBookingForm';

export const metadata = { title: 'New Booking — KaamConnect' };

export default function NewBookingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Request a Booking</h1>
      <p className="text-sm text-gray-500 mb-6">Describe the job and we'll connect you with the worker.</p>
      <Suspense fallback={<p>Loading…</p>}>
        <NewBookingForm />
      </Suspense>
    </div>
  );
}
