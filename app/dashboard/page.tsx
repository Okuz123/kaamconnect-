import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardIndex() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('primary_role')
    .eq('id', user.id)
    .single();

  const role = profile?.primary_role ?? 'customer';
  if (role === 'admin' || role === 'manager') redirect('/dashboard/admin');
  if (role === 'worker' || role === 'both') redirect('/dashboard/worker');
  redirect('/dashboard/customer');
}
