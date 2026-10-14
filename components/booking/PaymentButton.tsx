'use client';
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';

declare global {
  interface Window { Razorpay: any; }
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
        setErr('Payments are not yet activated. Ask the platform admin to add Razorpay keys.');
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
    <div className="mt-5">
      <button
        onClick={startPayment} disabled={busy}
        className="w-full flex items-center justify-center gap-2 bg-success-600 hover:bg-success-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-sm hover:shadow-md transition"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        {busy ? 'Opening payment…' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>
      {err && <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded-xl">{err}</div>}
      <p className="mt-3 text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" /> Secured by Razorpay. Runs in sandbox until live keys are added.
      </p>
    </div>
  );
}
