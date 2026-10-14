import { createClient } from '@/lib/supabase/server';

export default async function AdminSettings() {
  const supabase = createClient();
  const { data: rows } = await supabase.from('platform_settings').select('*').order('key');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Platform Settings</h1>
        <p className="text-gray-500 text-sm">Commission, booking rules, payout thresholds.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {(rows || []).map((s) => (
          <div key={s.key} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 capitalize">{s.key}</div>
            <pre className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg overflow-x-auto">{JSON.stringify(s.value, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
