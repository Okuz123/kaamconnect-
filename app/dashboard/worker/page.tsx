import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/dashboard/StatCard';

export default async function WorkerOverview() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: wp } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const { count: jobsCompleted } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('worker_id', wp?.id || '00000000-0000-0000-0000-000000000000')
    .eq('status', 'paid');

  if (!wp) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <h2 className="text-lg font-semibold mb-2">Complete your worker profile</h2>
        <p className="text-sm text-gray-500 mb-4">You need a profile before you can receive job requests.</p>
        <Link href="/dashboard/worker/profile" className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2 rounded-lg">
          Create profile
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Worker Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Rating" value={Number(wp.rating_avg).toFixed(1) + ' ★'} />
        <StatCard label="Reviews" value={wp.rating_count} />
        <StatCard label="Jobs completed" value={jobsCompleted ?? 0} />
        <StatCard label="Availability" value={wp.availability} />
      </div>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <Link href="/dashboard/worker/profile" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-400">
          <div className="font-semibold text-gray-900">Edit profile</div>
          <div className="text-sm text-gray-500">Skills, rates, availability, portfolio</div>
        </Link>
        <Link href="/dashboard/worker/earnings" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-400">
          <div className="font-semibold text-gray-900">Earnings</div>
          <div className="text-sm text-gray-500">Balance and payout history</div>
        </Link>
      </div>
    </div>
  );
}
