'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Navigation, Calendar, IndianRupee, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function NewBookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const workerId = params.get('worker');
  const presetCategoryId = params.get('cat');

  const [categories, setCategories] = useState<{ id: string; name_en: string; slug: string }[]>([]);
  const [workerName, setWorkerName] = useState<string | null>(null);
  const [form, setForm] = useState({
    category_id: presetCategoryId || '',
    title: '',
    description: '',
    scheduled_at: '',
    proposed_budget: '',
    address: '',
    lat: null as number | null,
    lng: null as number | null,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('skill_categories').select('id, name_en, slug').eq('is_active', true).order('sort_order')
      .then(({ data }) => setCategories(data || []));

    if (workerId) {
      supabase.from('worker_profiles').select('public_name, primary_skill_id').eq('id', workerId).maybeSingle()
        .then(({ data }) => {
          if (data) {
            setWorkerName(data.public_name);
            if (data.primary_skill_id && !presetCategoryId) {
              setForm((f) => ({ ...f, category_id: data.primary_skill_id! }));
            }
          }
        });
    }
  }, [workerId, presetCategoryId]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login?next=/booking/new'); return; }

    let { data: cp } = await supabase.from('customer_profiles').select('id').eq('user_id', user.id).maybeSingle();
    if (!cp) {
      const { data } = await supabase.from('customer_profiles').insert({ user_id: user.id }).select('id').single();
      cp = data;
    }
    if (!cp) { setErr('Could not create customer profile'); setBusy(false); return; }

    const { data: job, error } = await supabase
      .from('job_requests')
      .insert({
        customer_id: cp.id,
        worker_id: workerId || null,
        category_id: form.category_id,
        title: form.title,
        description: form.description,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
        proposed_budget: form.proposed_budget ? Number(form.proposed_budget) : null,
        address: form.address || null,
        lat: form.lat,
        lng: form.lng,
        status: 'requested',
      })
      .select('id')
      .single();

    if (error || !job) { setErr(error?.message || 'Failed'); setBusy(false); return; }

    if (workerId) {
      await supabase.from('bookings').insert({
        job_id: job.id,
        customer_id: cp.id,
        worker_id: workerId,
        status: 'requested',
        agreed_amount: form.proposed_budget ? Number(form.proposed_budget) : null,
      });
    }

    router.push(`/booking/${job.id}`);
  };

  return (
    <form onSubmit={submit} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 space-y-5">
      {workerName && (
        <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm">
          <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span className="text-brand-800">Requesting from <strong>{workerName}</strong></span>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job title</label>
        <div className="relative">
          <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Fix kitchen sink leak"
            className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Describe the work</label>
        <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What needs to be done? Any specific requirements…"
          className="w-full px-3.5 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition resize-none" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
          <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full px-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 outline-none transition">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">When?</label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 outline-none transition" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget (₹, optional)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="number" min="0" value={form.proposed_budget} onChange={(e) => setForm({ ...form, proposed_budget: e.target.value })}
              placeholder="500"
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 outline-none transition" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Your area, block, district"
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 outline-none transition" />
          </div>
        </div>
      </div>

      <button type="button" onClick={useMyLocation} disabled={locating}
        className={
          'text-sm font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg transition ' +
          (form.lat ? 'bg-success-50 text-success-700' : 'text-brand-600 hover:bg-brand-50')
        }>
        <Navigation className="w-4 h-4" />
        {locating ? 'Getting location…' : form.lat ? `📍 Location captured (${form.lat.toFixed(4)}, ${form.lng?.toFixed(4)})` : 'Use my current location'}
      </button>

      {err && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">{err}</div>}

      <button disabled={busy}
        className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-sm hover:shadow-md transition">
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        {busy ? 'Submitting…' : 'Submit request'}
      </button>
    </form>
  );
}
