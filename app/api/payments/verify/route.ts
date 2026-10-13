import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifySignature } from '@/lib/payments/razorpay-server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const ok = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient();

    // Idempotency: check if a transaction already exists for this payment
    const { data: existing } = await supabase
      .from('payment_transactions')
      .select('id')
      .eq('provider_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const { data: order } = await supabase
      .from('payment_orders')
      .select('id, amount')
      .eq('provider_order_id', razorpay_order_id)
      .maybeSingle();

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    await supabase.from('payment_transactions').insert({
      order_id: order.id,
      provider_payment_id: razorpay_payment_id,
      provider_signature: razorpay_signature,
      amount: order.amount,
      status: 'paid',
    });

    await supabase
      .from('payment_orders')
      .update({ status: 'paid' })
      .eq('id', order.id);

    await supabase
      .from('bookings')
      .update({ status: 'paid' })
      .eq('id', booking_id);

    // Ledger entry (append-only)
    await supabase.from('financial_ledger').insert([
      { booking_id, account_type: 'customer', entry_type: 'debit', amount: order.amount, description: 'Customer payment' },
      { booking_id, account_type: 'worker', entry_type: 'credit', amount: order.amount, description: 'Worker gross earnings' },
    ]);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
