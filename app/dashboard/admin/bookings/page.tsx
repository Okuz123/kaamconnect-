import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Badge from '@/components/ui/Badge';

export default async function AdminBookings() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('bookings')
    .select('id, status, total_amount, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Bookings</h1>
        <p className="text-gray-500 text-sm">{rows?.length ?? 0} booking{(rows?.length ?? 0) === 1 ? '' : 's'} on platform</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {(rows || []).length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No bookings yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rows!.map((b) => (
              <li key={b.id}>
                <Link href={`/booking/${b.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                  <div>
                    <div className="font-semibold text-gray-900">#{b.id.slice(0, 8)}</div>
                    <div className="text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge tone={b.status === 'paid' ? 'success' : 'brand'}>{b.status.replace(/_/g, ' ')}</Badge>
                  <span className="font-bold text-gray-900">₹{Number(b.total_amount || 0).toLocaleString('en-IN')}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
