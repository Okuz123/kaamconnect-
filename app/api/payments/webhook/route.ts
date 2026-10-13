import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/lib/payments/razorpay-server';

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    if (!verifyWebhookSignature(raw, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(raw);
    const eventType = event.event;
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    const paymentId = payment?.id;

    if (!paymentId || !orderId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Idempotency: if transaction already exists, skip
    const { data: existing } = await supabase
      .from('payment_transactions')
      .select('id')
      .eq('provider_payment_id', paymentId)
      .maybeSingle();

    if (existing) return NextResponse.json({ ok: true, duplicate: true });

    const { data: order } = await supabase
      .from('payment_orders')
      .select('id, booking_id, amount')
      .eq('provider_order_id', orderId)
      .maybeSingle();

    if (!order) return NextResponse.json({ ok: true, unknown_order: true });

    if (eventType === 'payment.captured' || eventType === 'payment.authorized') {
      await supabase.from('payment_transactions').insert({
        order_id: order.id,
        provider_payment_id: paymentId,
        amount: order.amount,
        status: 'paid',
        raw_webhook_payload: event,
      });

      await supabase.from('payment_orders').update({ status: 'paid' }).eq('id', order.id);
      await supabase.from('bookings').update({ status: 'paid' }).eq('id', order.booking_id);
    } else if (eventType === 'payment.failed') {
      await supabase.from('payment_transactions').insert({
        order_id: order.id,
        provider_payment_id: paymentId,
        amount: order.amount,
        status: 'failed',
        raw_webhook_payload: event,
      });
      await supabase.from('payment_orders').update({ status: 'failed' }).eq('id', order.id);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Webhook error' }, { status: 500 });
  }
}
