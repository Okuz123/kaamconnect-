import { createClient } from '@/lib/supabase/server';

export interface CreateJobInput {
  category_id: string;
  title: string;
  description: string;
  scheduled_at?: string;
  proposed_budget?: number;
  address?: string;
  lat?: number;
  lng?: number;
  worker_id?: string;
}

export async function createJobRequest(input: CreateJobInput) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };

  // Ensure customer profile
  let { data: cp } = await supabase
    .from('customer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!cp) {
    const { data } = await supabase
      .from('customer_profiles')
      .insert({ user_id: user.id })
      .select('id')
      .single();
    cp = data;
  }
  if (!cp) return { error: 'Could not create customer profile' };

  const { data: job, error } = await supabase
    .from('job_requests')
    .insert({
      customer_id: cp.id,
      category_id: input.category_id,
      title: input.title,
      description: input.description,
      scheduled_at: input.scheduled_at || null,
      proposed_budget: input.proposed_budget || null,
      address: input.address || null,
      lat: input.lat || null,
      lng: input.lng || null,
      worker_id: input.worker_id || null,
      status: input.worker_id ? 'requested' : 'requested',
    })
    .select('id')
    .single();

  if (error || !job) return { error: error?.message || 'Failed to create job' };

  // If a specific worker was chosen, create a booking link
  if (input.worker_id) {
    await supabase.from('bookings').insert({
      job_id: job.id,
      customer_id: cp.id,
      worker_id: input.worker_id,
      status: 'requested',
      agreed_amount: input.proposed_budget || null,
    });
  }

  return { id: job.id };
}

export async function getBookingById(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('bookings')
    .select(`
      *,
      job:job_id(*),
      customer:customer_id(id, user:user_id(full_name, phone)),
      worker:worker_id(id, public_name, user:user_id(full_name, phone))
    `)
    .eq('id', id)
    .maybeSingle();
  return data;
}

export async function updateBookingStatus(bookingId: string, from: string, to: string, note?: string) {
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
