import { createClient } from '@/lib/supabase/server';

export default async function AdminPayments() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('payment_transactions')
    .select('id, provider_payment_id, amount, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Payments</h1>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {(rows || []).length === 0 ? <div className="p-6 text-gray-500 text-sm">No transactions yet.</div> :
          rows!.map((p) => (
            <div key={p.id} className="p-4 flex justify-between text-sm">
              <span>{p.provider_payment_id || p.id.slice(0, 8)}</span>
              <span className="capitalize">{p.status}</span>
              <span className="font-semibold">₹{Number(p.amount).toLocaleString('en-IN')}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
