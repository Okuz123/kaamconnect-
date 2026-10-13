import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOrder, isRazorpayConfigured } from '@/lib/payments/razorpay-server';

export async function POST(req: Request) {
  try {
    const { booking_id, amount } = await req.json();
    if (!booking_id || !amount) {
      return NextResponse.json({ error: 'booking_id and amount required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    // Server-side amount recompute (never trust client)
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, total_amount, agreed_amount, status')
      .eq('id', booking_id)
      .maybeSingle();

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const serverAmount = Number(booking.total_amount || booking.agreed_amount || 0);
    if (serverAmount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    // If Razorpay isn't configured, return a clear message (never fake success)
    if (!isRazorpayConfigured()) {
      const { data: order } = await supabase
        .from('payment_orders')
        .insert({
          booking_id,
          provider: 'razorpay',
          amount: serverAmount,
          currency: 'INR',
          status: 'created',
          mode: 'sandbox',
        })
        .select('id')
        .single();

      return NextResponse.json({
        order_id: order?.id || null,
        amount: Math.round(serverAmount * 100),
        currency: 'INR',
        key_id: null,
        sandbox: true,
        message: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to activate live checkout.',
      }, { status: 200 });
    }

    const receipt = `bk_${booking_id.slice(0, 8)}_${Date.now()}`;
    const result = await createOrder(serverAmount, receipt);
    if ('error' in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const order = result.order!;

    await supabase.from('payment_orders').insert({
      booking_id,
      provider: 'razorpay',
      provider_order_id: order.id,
      amount: serverAmount,
      currency: 'INR',
      status: 'created',
      mode: process.env.PAYMENT_MODE || 'sandbox',
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      sandbox: (process.env.PAYMENT_MODE || 'sandbox') === 'sandbox',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
