'use client';
import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function PaymentButton({ booking, amount }: { booking: any; amount: number }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const startPayment = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: booking.id, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      if (!data.key_id) {
        setErr('Razorpay not configured. Add RAZORPAY_KEY_ID + SECRET to environment.');
        setBusy(false);
        return;
      }

      const { loadScript } = await import('@/lib/payments/razorpay-client');
      await loadScript();

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'KaamConnect',
        description: `Booking ${booking.id.slice(0, 8)}`,
        order_id: data.order_id,
        handler: async (response: RazorpayResponse) => {
          await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, booking_id: booking.id }),
          });
          window.location.href = '/payment-result?status=success';
        },
        theme: { color: '#1e40af' },
      });
      rzp.open();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={startPayment} disabled={busy}
        className="w-full bg-success-600 hover:bg-success-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg"
      >
        {busy ? 'Opening payment…' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <p className="mt-2 text-xs text-gray-400">Payments run in sandbox mode until Razorpay live keys are configured.</p>
    </div>
  );
}
