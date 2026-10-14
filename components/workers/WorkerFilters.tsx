'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Navigation, SlidersHorizontal, X } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);

  const apply = (overrides: Record<string, string> = {}) => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (cat) sp.set('cat', cat);
    if (radius) sp.set('r', String(radius));
    if (sort) sp.set('sort', sort);
    if (lat) sp.set('lat', lat);
    if (lng) sp.set('lng', lng);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
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
        setLat(la);
        setLng(lo);
        setLocating(false);
        apply({ lat: la, lng: lo, r: String(radius) });
      },
      () => setLocating(false)
    );
  };

  const clearAll = () => {
    setQ(''); setCat(''); setRadius(3); setSort('nearest'); setLat(''); setLng('');
    router.push('/workers');
  };

  const hasFilters = q || cat || lat || sort !== 'nearest' || radius !== 3;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-[0_1px_3px_rgb(0,0,0,0.02)]">
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder={t('hero.search')}
            className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
          />
        </div>
        <button
          onClick={useMyLocation}
          disabled={locating}
          className={
            'px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition ' +
            (lat ? 'bg-brand-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent')
          }
        >
          <Navigation className="w-4 h-4" />
          <span className="hidden sm:inline">{locating ? '…' : lat ? 'Located' : 'Near me'}</span>
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="md:hidden px-3 py-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className={'md:flex md:items-center md:justify-between gap-3 ' + (expanded ? 'block' : 'hidden md:flex')}>
        <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-0">
          <select
            value={cat}
            onChange={(e) => { setCat(e.target.value); apply({ cat: e.target.value }); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-brand-500 outline-none"
          >
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name_en}</option>)}
          </select>

          <div className="flex items-center gap-1">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => { setRadius(r); apply({ r: String(r) }); }}
                className={
                  'px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ' +
                  (radius === r
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400')
                }
              >
                {r}km
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); apply({ sort: e.target.value }); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-brand-500 outline-none"
          >
            <option value="nearest">Sort: Nearest</option>
            <option value="rating">Best rated</option>
            <option value="price">Lowest price</option>
            <option value="experience">Most experienced</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1 px-2 py-1.5"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
