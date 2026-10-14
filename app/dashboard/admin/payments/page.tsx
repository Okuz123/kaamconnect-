import { createClient } from '@/lib/supabase/server';
import Badge from '@/components/ui/Badge';

export default async function AdminPayments() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('payment_transactions')
    .select('id, provider_payment_id, amount, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Payments</h1>
        <p className="text-gray-500 text-sm">All transactions across the platform.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {(rows || []).length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No transactions yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rows!.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="font-semibold text-gray-900">{p.provider_payment_id || p.id.slice(0, 12)}</div>
                  <div className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</div>
                </div>
                <Badge tone={p.status === 'paid' ? 'success' : p.status === 'failed' ? 'warning' : 'brand'}>{p.status}</Badge>
                <span className="font-bold text-gray-900">₹{Number(p.amount).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
