'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateBookingStatus } from '@/lib/data/booking-client';

const WORKER_NEXT: Record<string, { label: string; to: string }[]> = {
  requested: [
    { label: 'Accept', to: 'accepted' },
    { label: 'Decline', to: 'declined' },
  ],
  accepted: [{ label: 'Mark work started', to: 'work_started' }],
  worker_en_route: [{ label: 'Mark work started', to: 'work_started' }],
  work_started: [{ label: 'Mark completed', to: 'work_completed' }],
};

const CUSTOMER_NEXT: Record<string, { label: string; to: string }[]> = {
  requested: [{ label: 'Cancel', to: 'cancelled' }],
  accepted: [{ label: 'Cancel', to: 'cancelled' }],
  work_completed: [{ label: 'Confirm work done', to: 'payment_processing' }],
};

export default function BookingActions({ booking }: { booking: any }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const actions = [...(WORKER_NEXT[booking.status] || []), ...(CUSTOMER_NEXT[booking.status] || [])];
  if (actions.length === 0) return null;

  const run = async (to: string) => {
    setBusy(true);
    await updateBookingStatus(booking.id, booking.status, to);
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <button
          key={a.to}
          disabled={busy}
          onClick={() => run(a.to)}
          className={
            'px-4 py-2 rounded-lg font-medium text-sm ' +
            (a.to === 'declined' || a.to === 'cancelled'
              ? 'border border-red-300 text-red-600 hover:bg-red-50'
              : 'bg-brand-600 text-white hover:bg-brand-700')
          }
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
