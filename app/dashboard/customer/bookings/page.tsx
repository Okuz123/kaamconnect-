import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Badge from '@/components/ui/Badge';
import { Calendar } from 'lucide-react';

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
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-6">My Bookings</h1>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center mb-5">
            <Calendar className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-sm text-gray-500 mb-6">When you book a worker, it appears here.</p>
          <Link href="/workers" className="inline-flex bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl">
            Find a worker
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {rows.map((b) => (
              <li key={b.id}>
                <Link href={`/booking/${b.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                  <div>
                    <div className="font-bold text-gray-900">{(b.worker as any)?.public_name || 'Worker'}</div>
                    <div className="text-xs text-gray-400">#{b.id.slice(0, 8)} • {new Date(b.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge tone={b.status === 'paid' ? 'success' : 'brand'}>{b.status.replace(/_/g, ' ')}</Badge>
                  <span className="font-bold text-gray-900">₹{Number(b.total_amount || 0).toLocaleString('en-IN')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
