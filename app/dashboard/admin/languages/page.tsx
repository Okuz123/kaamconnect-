import { createClient } from '@/lib/supabase/server';

export default async function AdminLanguages() {
  const supabase = createClient();
  const { data: rows } = await supabase.from('translations').select('lang').limit(1000);

  const counts = (rows || []).reduce((acc: Record<string, number>, r: any) => {
    acc[r.lang] = (acc[r.lang] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Languages & Translations</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-sm text-gray-500 mb-3">Translation counts by language</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['en','hi','ur','dogri','ks'].map((l) => (
            <div key={l} className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-lg font-bold">{counts[l] || 0}</div>
              <div className="text-xs uppercase text-gray-500">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
