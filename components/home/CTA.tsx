'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useLang } from '@/lib/i18n/useLang';

export default function CTA() {
  const { t } = useLang();
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-700 px-8 py-14 md:px-16 md:py-20 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-success-400/20 blur-3xl" />
          </div>

          <div className="relative max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{t('cta.title')}</h2>
            <p className="text-brand-100 text-base md:text-lg mb-8">{t('cta.sub')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition shadow-lg">
                {t('cta.register')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/workers" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition">
                {t('hero.find')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
