'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function WorkerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name_en: string }[]>([]);
  const [form, setForm] = useState({
    id: '',
    public_name: '',
    legal_name: '',
    bio: '',
    years_experience: 0,
    primary_skill_id: '',
    daily_rate: '',
    hourly_rate: '',
    preferred_radius_km: 3,
    availability: 'available' as 'available' | 'busy' | 'unavailable',
  });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cats } = await supabase
        .from('skill_categories')
        .select('id, name_en')
        .eq('is_active', true)
        .order('sort_order');

      setCategories(cats || []);

      const { data: wp } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (wp) {
        setForm({
          id: wp.id,
          public_name: wp.public_name ?? '',
          legal_name: wp.legal_name ?? '',
          bio: wp.bio ?? '',
          years_experience: wp.years_experience ?? 0,
          primary_skill_id: wp.primary_skill_id ?? '',
          daily_rate: wp.daily_rate?.toString() ?? '',
          hourly_rate: wp.hourly_rate?.toString() ?? '',
          preferred_radius_km: wp.preferred_radius_km ?? 3,
          availability: wp.availability ?? 'available',
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      public_name: form.public_name,
      legal_name: form.legal_name || null,
      bio: form.bio || null,
      years_experience: Number(form.years_experience) || 0,
      primary_skill_id: form.primary_skill_id || null,
      daily_rate: form.daily_rate ? Number(form.daily_rate) : null,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      preferred_radius_km: Number(form.preferred_radius_km) || 3,
      availability: form.availability,
    };

    let err;
    if (form.id) {
      ({ error: err } = await supabase.from('worker_profiles').update(payload).eq('id', form.id));
    } else {
      const { data, error } = await supabase.from('worker_profiles').insert(payload).select('id').single();
      err = error;
      if (data) setForm((f) => ({ ...f, id: data.id }));
    }

    setSaving(false);
    setMsg(err ? err.message : 'Profile saved ✅');
  };

  if (loading) return <p className="text-gray-500">Loading…</p>;

  return (
    <form onSubmit={save} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h1 className="text-xl font-bold">Worker Profile</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Public name</label>
          <input
            required value={form.public_name}
            onChange={(e) => setForm({ ...form, public_name: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Legal name (private)</label>
          <input
            value={form.legal_name}
            onChange={(e) => setForm({ ...form, legal_name: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          rows={3} value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary skill</label>
          <select
            required value={form.primary_skill_id}
            onChange={(e) => setForm({ ...form, primary_skill_id: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="">Select skill</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of experience</label>
          <input
            type="number" min="0" value={form.years_experience}
            onChange={(e) => setForm({ ...form, years_experience: Number(e.target.value) })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Daily rate (₹)</label>
          <input
            type="number" min="0" value={form.daily_rate}
            onChange={(e) => setForm({ ...form, daily_rate: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly rate (₹)</label>
          <input
            type="number" min="0" value={form.hourly_rate}
            onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work radius (km)</label>
          <input
            type="number" min="1" max="100" value={form.preferred_radius_km}
            onChange={(e) => setForm({ ...form, preferred_radius_km: Number(e.target.value) })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
        <select
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value as any })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {msg && <p className={`text-sm p-3 rounded-lg ${msg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{msg}</p>}

      <button
        type="submit" disabled={saving}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg"
      >
        {saving ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}
