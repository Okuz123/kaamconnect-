import { createClient } from '@/lib/supabase/server';

export default async function AdminLanguages() {
  const supabase = createClient();
  const { data: rows } = await supabase.from('translations').select('lang').limit(1000);

  const counts = (rows || []).reduce((acc: Record<string, number>, r: any) => {
    acc[r.lang] = (acc[r.lang] || 0) + 1;
    return acc;
  }, {});

  const LANGS = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'dogri', label: 'Dogri', native: 'डोगरी' },
    { code: 'ks', label: 'Kashmiri', native: 'کٲشُر' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Languages</h1>
        <p className="text-gray-500 text-sm">5 supported languages. Interface strings bundled; DB-driven overrides shown here.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {LANGS.map((l) => (
          <div key={l.code} className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
            <div className="text-3xl font-extrabold text-brand-700 mb-1">{counts[l.code] || 0}</div>
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{l.label}</div>
            <div className="text-sm text-gray-700 mt-1">{l.native}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
