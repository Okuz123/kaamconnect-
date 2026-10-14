'use client';
import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const L: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  marginTop: 16,
  color: '#374151',
};

const inputCls = 'w-full px-3.5 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition';

export default function WorkerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
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
        .from('skill_categories').select('id, name_en').eq('is_active', true).order('sort_order');
      setCategories(cats || []);

      const { data: wp } = await supabase
        .from('worker_profiles').select('*').eq('user_id', user.id).maybeSingle();

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
    setMsg(err ? { text: err.message, ok: false } : { text: 'Profile saved successfully', ok: true });
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading…</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Worker Profile</h1>
        <p className="text-gray-500 text-sm">Fill this so employers near you can find and book you.</p>
      </div>

      <form onSubmit={save} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label style={L}>Public name</label>
            <input required value={form.public_name} onChange={(e) => setForm({ ...form, public_name: e.target.value })}
              placeholder="Name shown to customers" className={inputCls} />
          </div>
          <div>
            <label style={L}>Legal name (private)</label>
            <input value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })}
              placeholder="For verification only" className={inputCls} />
          </div>
        </div>

        <label style={L}>Short bio</label>
        <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell employers about your work, experience, specialties…"
          className={inputCls + ' resize-none'} />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label style={L}>Primary skill</label>
            <select required value={form.primary_skill_id} onChange={(e) => setForm({ ...form, primary_skill_id: e.target.value })}
              className={inputCls}>
              <option value="">Select skill</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </div>
          <div>
            <label style={L}>Years of experience</label>
            <input type="number" min="0" value={form.years_experience}
              onChange={(e) => setForm({ ...form, years_experience: Number(e.target.value) })}
              className={inputCls} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label style={L}>Daily rate (₹)</label>
            <input type="number" min="0" value={form.daily_rate}
              onChange={(e) => setForm({ ...form, daily_rate: e.target.value })}
              placeholder="600" className={inputCls} />
          </div>
          <div>
            <label style={L}>Hourly rate (₹)</label>
            <input type="number" min="0" value={form.hourly_rate}
              onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
              placeholder="80" className={inputCls} />
          </div>
          <div>
            <label style={L}>Work radius (km)</label>
            <input type="number" min="1" max="100" value={form.preferred_radius_km}
              onChange={(e) => setForm({ ...form, preferred_radius_km: Number(e.target.value) })}
              className={inputCls} />
          </div>
        </div>

        <label style={L}>Availability</label>
        <div className="grid grid-cols-3 gap-2">
          {(['available', 'busy', 'unavailable'] as const).map((a) => (
            <button key={a} type="button" onClick={() => setForm({ ...form, availability: a })}
              className={
                'py-2.5 px-3 rounded-xl text-sm font-semibold capitalize border-2 transition ' +
                (form.availability === a
                  ? a === 'available'
                    ? 'bg-success-50 border-success-500 text-success-700'
                    : a === 'busy'
                    ? 'bg-amber-50 border-amber-500 text-amber-700'
                    : 'bg-gray-100 border-gray-400 text-gray-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300')
              }>
              {a}
            </button>
          ))}
        </div>

        {msg && (
          <div className={'mt-5 flex items-center gap-2 text-sm p-3 rounded-xl border ' +
            (msg.ok ? 'bg-success-50 text-success-700 border-success-100' : 'bg-red-50 text-red-600 border-red-100')}>
            {msg.ok && <CheckCircle2 className="w-4 h-4" />}
            {msg.text}
          </div>
        )}

        <button disabled={saving}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-sm hover:shadow-md transition">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
