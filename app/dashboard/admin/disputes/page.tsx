import { createClient } from '@/lib/supabase/server';
import Badge from '@/components/ui/Badge';
import { AlertTriangle } from 'lucide-react';

export default async function AdminDisputes() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('disputes')
    .select('id, reason, status, created_at, booking_id')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Disputes</h1>
        <p className="text-gray-500 text-sm">Customer-reported issues requiring review.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {(rows || []).length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-success-50 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-success-600" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">All clear</div>
            <p className="text-sm text-gray-500">No disputes reported.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rows!.map((d) => (
              <li key={d.id} className="px-6 py-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-semibold text-gray-900">{d.reason}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Booking #{d.booking_id.slice(0, 8)} • {new Date(d.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge tone={d.status === 'resolved' ? 'success' : 'warning'}>{d.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
