'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AddressesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: '', full_address: '', district: '', pin_code: '' });

  const load = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cp } = await supabase.from('customer_profiles').select('id').eq('user_id', user.id).maybeSingle();
    if (!cp) { setLoading(false); return; }

    const { data } = await supabase
      .from('customer_addresses').select('*').eq('customer_id', cp.id).order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let { data: cp } = await supabase.from('customer_profiles').select('id').eq('user_id', user.id).maybeSingle();
    if (!cp) {
      const { data } = await supabase.from('customer_profiles').insert({ user_id: user.id }).select('id').single();
      cp = data;
    }
    if (!cp) return;

    await supabase.from('customer_addresses').insert({ customer_id: cp.id, ...form });
    setForm({ label: '', full_address: '', district: '', pin_code: '' });
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Saved Addresses</h1>

      <form onSubmit={save} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 mb-6">
        <div className="grid sm:grid-cols-2 gap-3">
          <input required placeholder="Label (Home, Office)" value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input required placeholder="District" value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            className="px-3 py-2.5 border border-gray-300 rounded-lg" />
        </div>
        <input required placeholder="Full address" value={form.full_address}
          onChange={(e) => setForm({ ...form, full_address: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
        <input placeholder="PIN code" value={form.pin_code}
          onChange={(e) => setForm({ ...form, pin_code: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
        <button className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium">Add address</button>
      </form>

      {loading ? <p>Loading…</p> : rows.length === 0 ? (
        <p className="text-gray-500 text-sm">No saved addresses yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="font-medium">{r.label}</div>
              <div className="text-sm text-gray-500">{r.full_address} — {r.district} {r.pin_code}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
