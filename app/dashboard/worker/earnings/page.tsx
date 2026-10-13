import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/dashboard/StatCard';

export default async function WorkerEarnings() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: wp } = await supabase
    .from('worker_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  let totalEarned = 0;
  let pending = 0;
  const recent: any[] = [];

  if (wp) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, status, total_amount, platform_fee, tax_amount, completed_at')
      .eq('worker_id', wp.id)
      .order('created_at', { ascending: false })
      .limit(50);

    for (const b of bookings || []) {
      const amt = Number(b.total_amount || 0) - Number(b.platform_fee || 0) - Number(b.tax_amount || 0);
      if (b.status === 'paid') totalEarned += amt;
      else if (['work_completed', 'payment_processing'].includes(b.status)) pending += amt;
      recent.push(b);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Earnings</h1>
      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Total earned" value={'₹' + totalEarned.toLocaleString('en-IN')} />
        <StatCard label="Pending" value={'₹' + pending.toLocaleString('en-IN')} />
        <StatCard label="Jobs" value={recent.length} />
      </div>
      <div className="mt-6 bg-white border border-gray-200 rounded-xl">
        <div className="p-4 border-b border-gray-100 font-semibold">Recent bookings</div>
        {recent.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No bookings yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((b) => (
              <li key={b.id} className="p-4 flex justify-between text-sm">
                <span className="text-gray-500">{b.id.slice(0, 8)}…</span>
                <span className="font-medium capitalize">{b.status.replace(/_/g, ' ')}</span>
                <span className="font-semibold">₹{Number(b.total_amount || 0).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
