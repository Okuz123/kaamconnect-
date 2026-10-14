import { createClient } from '@/lib/supabase/server';
import Badge from '@/components/ui/Badge';
import { MapPin } from 'lucide-react';

export default async function AdminLocations() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('locations')
    .select('id, level, name, is_active')
    .order('level')
    .limit(500);

  const grouped = (rows || []).reduce((acc: Record<string, any[]>, r: any) => {
    acc[r.level] = acc[r.level] || [];
    acc[r.level].push(r);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Locations</h1>
        <p className="text-gray-500 text-sm">States, districts, tehsils, blocks, villages.</p>
      </div>

      {(rows || []).length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-brand-600" />
          </div>
          <div className="font-semibold text-gray-900 mb-1">No locations imported yet</div>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Location data can be imported via SQL. Each state, district, block, and village becomes a searchable record.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([level, items]) => (
            <div key={level} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="font-bold text-gray-900 capitalize">{level}</div>
                <Badge tone="brand">{(items as any[]).length}</Badge>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <ul className="divide-y divide-gray-100">
                  {(items as any[]).map((l) => (
                    <li key={l.id} className="px-5 py-2.5 text-sm text-gray-700">{l.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
