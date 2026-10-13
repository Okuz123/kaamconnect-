import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function CustomerBookings() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: cp } = await supabase
    .from('customer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  let rows: any[] = [];
  if (cp) {
    const { data } = await supabase
      .from('bookings')
      .select('id, status, total_amount, scheduled_at, created_at, worker:worker_id(public_name)')
      .eq('customer_id', cp.id)
      .order('created_at', { ascending: false });
    rows = data || [];
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">My Bookings</h1>
      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500 mb-3">No bookings yet.</p>
          <Link href="/workers" className="inline-block bg-brand-600 text-white px-4 py-2 rounded-lg">Find a worker</Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {rows.map((b) => (
            <Link key={b.id} href={`/booking/${b.id}`} className="block p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{(b.worker as any)?.public_name || 'Worker'}</div>
                  <div className="text-xs text-gray-500">#{b.id.slice(0, 8)} • {b.status.replace(/_/g, ' ')}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{Number(b.total_amount || 0).toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
