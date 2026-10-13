import { createClient } from '@/lib/supabase/server';

export default async function AdminLocations() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('locations')
    .select('id, level, name, is_active')
    .order('level')
    .limit(500);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Locations</h1>
      <p className="text-sm text-gray-500 mb-4">
        Manage states, districts, tehsils, blocks, and villages. Bulk import available via SQL.
      </p>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {(rows || []).length === 0 ? <div className="p-6 text-gray-500 text-sm">No locations imported yet.</div> :
          rows!.map((l) => (
            <div key={l.id} className="p-3 text-sm flex justify-between">
              <span>{l.name}</span>
              <span className="text-xs uppercase text-gray-400">{l.level}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
