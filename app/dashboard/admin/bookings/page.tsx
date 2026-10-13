import { createClient } from '@/lib/supabase/server';

export default async function AdminBookings() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('bookings')
    .select('id, status, total_amount, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Bookings</h1>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {(rows || []).length === 0 ? <div className="p-6 text-gray-500 text-sm">No bookings yet.</div> :
          rows!.map((b) => (
            <div key={b.id} className="p-4 flex justify-between text-sm">
              <span>#{b.id.slice(0, 8)}</span>
              <span className="capitalize">{b.status.replace(/_/g, ' ')}</span>
              <span className="font-semibold">₹{Number(b.total_amount || 0).toLocaleString('en-IN')}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
