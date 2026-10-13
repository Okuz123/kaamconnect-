'use client';
import { useState } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n/useLang';
import { RADIUS_OPTIONS } from '@/lib/utils/geo';

export default function Hero() {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState<number>(3);
  const [locating, setLocating] = useState(false);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const searchUrl = `/workers?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}&r=${radius}`;

  return (
    <section className="bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-14 md:py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          {t('hero.sub')}
        </p>

        <div className="bg-white rounded-2xl shadow-card border border-gray-200 p-4 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder={t('hero.search')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder={t('hero.location')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-600 hover:text-brand-700 px-2 py-1 rounded flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                {locating ? '...' : t('hero.useLocation')}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
            <span className="text-gray-500">{t('hero.radius')}:</span>
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={
                  'px-3 py-1 rounded-full border text-xs font-medium ' +
                  (radius === r
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400')
                }
              >
                {r} km
              </button>
            ))}
          </div>

          <Link
            href={searchUrl}
            className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {t('hero.find')}
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href="/register?role=worker" className="text-sm font-medium text-brand-700 hover:underline">
            {t('hero.become')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
