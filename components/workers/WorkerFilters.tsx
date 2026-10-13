'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Navigation } from 'lucide-react';
import { RADIUS_OPTIONS } from '@/lib/utils/geo';
import { useLang } from '@/lib/i18n/useLang';

export default function WorkerFilters({ categories }: { categories: { id: string; slug: string; name_en: string }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLang();

  const [q, setQ] = useState(params.get('q') || '');
  const [cat, setCat] = useState(params.get('cat') || '');
  const [radius, setRadius] = useState(Number(params.get('r')) || 3);
  const [sort, setSort] = useState(params.get('sort') || 'nearest');
  const [lat, setLat] = useState(params.get('lat') || '');
  const [lng, setLng] = useState(params.get('lng') || '');
  const [locating, setLocating] = useState(false);

  const apply = (overrides: Record<string, string> = {}) => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (cat) sp.set('cat', cat);
    if (radius) sp.set('r', String(radius));
    if (sort) sp.set('sort', sort);
    if (lat) sp.set('lat', lat);
    if (lng) sp.set('lng', lng);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v); else sp.delete(k);
    }
    router.push('/workers?' + sp.toString());
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude.toFixed(6);
        const lo = pos.coords.longitude.toFixed(6);
        setLat(la); setLng(lo);
        setLocating(false);
        apply({ lat: la, lng: lo, r: String(radius) });
      },
      () => setLocating(false)
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
      <div className="grid md:grid-cols-[1fr_auto_auto] gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder={t('hero.search')}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <select
          value={cat} onChange={(e) => { setCat(e.target.value); apply({ cat: e.target.value }); }}
          className="px-3 py-2.5 border border-gray-300 rounded-lg min-w-[160px]"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name_en}</option>)}
        </select>
        <button
          onClick={useMyLocation} disabled={locating}
          className="px-4 py-2.5 border border-brand-500 text-brand-600 rounded-lg font-medium hover:bg-brand-50 flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          {locating ? '...' : t('hero.useLocation')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">{t('hero.radius')}:</span>
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r} onClick={() => { setRadius(r); apply({ r: String(r) }); }}
              className={
                'px-2.5 py-1 rounded-full text-xs font-medium border ' +
                (radius === r ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-gray-300 text-gray-700')
              }
            >{r} km</button>
          ))}
        </div>

        <select
          value={sort} onChange={(e) => { setSort(e.target.value); apply({ sort: e.target.value }); }}
          className="ml-auto px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="nearest">Nearest</option>
          <option value="rating">Best rated</option>
          <option value="price">Lowest price</option>
          <option value="experience">Most experienced</option>
        </select>
      </div>
    </div>
  );
}
