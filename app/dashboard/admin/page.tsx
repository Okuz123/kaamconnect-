import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/dashboard/StatCard';

export default async function AdminOverview() {
  const supabase = createClient();

  const [users, workers, jobs, bookings, payments, disputes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('worker_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('job_requests').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('payment_transactions').select('id', { count: 'exact', head: true }).eq('status', 'paid'),
    supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'open'),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Admin Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="Total users" value={users.count ?? 0} />
        <StatCard label="Workers" value={workers.count ?? 0} />
        <StatCard label="Job requests" value={jobs.count ?? 0} />
        <StatCard label="Bookings" value={bookings.count ?? 0} />
        <StatCard label="Paid transactions" value={payments.count ?? 0} />
        <StatCard label="Open disputes" value={disputes.count ?? 0} />
      </div>
    </div>
  );
}
