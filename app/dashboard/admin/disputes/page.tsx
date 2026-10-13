import { createClient } from '@/lib/supabase/server';

export default async function AdminDisputes() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('disputes')
    .select('id, reason, status, created_at, booking_id')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Disputes</h1>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {(rows || []).length === 0 ? <div className="p-6 text-gray-500 text-sm">No disputes.</div> :
          rows!.map((d) => (
            <div key={d.id} className="p-4 text-sm">
              <div className="font-medium">{d.reason}</div>
              <div className="text-gray-500 text-xs">Booking #{d.booking_id.slice(0, 8)} • {d.status}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
