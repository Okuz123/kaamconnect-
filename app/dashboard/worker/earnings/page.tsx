import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/dashboard/StatCard';
import Badge from '@/components/ui/Badge';

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
      .select('id, status, total_amount, platform_fee, tax_amount, created_at')
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
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-6">Earnings</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total earned" value={`₹${totalEarned.toLocaleString('en-IN')}`} tone="success" />
        <StatCard label="Pending" value={`₹${pending.toLocaleString('en-IN')}`} tone="amber" />
        <StatCard label="Bookings" value={recent.length} tone="brand" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-900">Recent bookings</div>
        {recent.length === 0 ? (
          <div className="p-8 text-sm text-gray-500 text-center">No bookings yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((b) => (
              <li key={b.id} className="px-6 py-4 flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium text-gray-900">#{b.id.slice(0, 8)}</div>
                  <div className="text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString()}</div>
                </div>
                <Badge tone={b.status === 'paid' ? 'success' : 'brand'}>{b.status.replace(/_/g, ' ')}</Badge>
                <span className="font-bold text-gray-900">₹{Number(b.total_amount || 0).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
