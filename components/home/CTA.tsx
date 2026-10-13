'use client';
import Link from 'next/link';
import { useLang } from '@/lib/i18n/useLang';

export default function CTA() {
  const { t } = useLang();
  return (
    <section className="bg-brand-600 text-white">
      <div className="mx-auto max-w-4xl px-4 py-14 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('cta.title')}</h2>
        <p className="text-brand-100 mb-6">{t('cta.sub')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register" className="px-6 py-3 rounded-lg bg-white text-brand-700 font-semibold hover:bg-gray-100">
            {t('cta.register')}
          </Link>
          <Link href="/workers" className="px-6 py-3 rounded-lg border border-white/40 font-semibold hover:bg-white/10">
            {t('hero.find')}
          </Link>
        </div>
      </div>
    </section>
  );
}
