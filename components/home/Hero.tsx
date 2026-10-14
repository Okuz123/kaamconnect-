'use client';
import { useState } from 'react';
import { Search, MapPin, Navigation, ShieldCheck, Star, Users } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useLang } from '@/lib/i18n/useLang';
import { RADIUS_OPTIONS } from '@/lib/utils/geo';

export default function Hero() {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(3);
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

  const searchUrl = `/workers?q=${encodeURIComponent(query)}&r=${radius}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-success-100/40 blur-3xl" />
      </div>

      <Container className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
            <span>Trusted by workers across Jammu &amp; Kashmir</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-5">
            {t('hero.title')}
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.sub')}
          </p>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-3 md:p-4 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-2 md:gap-3 mb-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('hero.search')}
                  className="w-full pl-10 pr-3 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('hero.location')}
                  className="w-full pl-10 pr-28 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
                />
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-600 hover:text-brand-700 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 flex items-center gap-1 transition"
                >
                  <Navigation className="w-3 h-3" />
                  {locating ? '…' : 'Locate'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3 px-1 text-xs">
              <span className="text-gray-500 font-medium mr-1">Radius:</span>
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={
                    'px-3 py-1 rounded-full border text-xs font-semibold transition ' +
                    (radius === r
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400')
                  }
                >
                  {r} km
                </button>
              ))}
            </div>

            <Button href={searchUrl} size="lg" className="w-full">
              <Search className="w-4 h-4" />
              {t('hero.find')}
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success-600" /> Verified workers</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> Real reviews</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-brand-600" /> Local to you</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
