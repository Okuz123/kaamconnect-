import { createClient } from '@/lib/supabase/server';

export default async function AdminSettings() {
  const supabase = createClient();
  const { data: rows } = await supabase.from('platform_settings').select('*').order('key');

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Platform Settings</h1>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {(rows || []).map((s) => (
          <div key={s.key} className="p-4">
            <div className="font-medium capitalize">{s.key}</div>
            <pre className="text-xs text-gray-500 mt-1 overflow-x-auto">{JSON.stringify(s.value, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
