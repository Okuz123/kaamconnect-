'use client';
import { createClient } from '@/lib/supabase/client';

export async function updateBookingStatus(
  bookingId: string,
  from: string,
  to: string,
  note?: string
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  const { error } = await supabase
    .from('bookings')
    .update({ status: to })
    .eq('id', bookingId)
    .eq('status', from);

  if (error) return { error: error.message };

  await supabase.from('booking_status_history').insert({
    booking_id: bookingId,
    from_state: from,
    to_state: to,
    actor_id: user.id,
    note: note || null,
  });

  return { ok: true };
}
