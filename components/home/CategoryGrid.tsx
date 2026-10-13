'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Wrench, Zap, Hammer, TreePine, Car, Paintbrush, Flame,
  HardHat, Snowflake, WashingMachine, Truck, Sparkles, Flower2,
  Square, Home, ChefHat, Scissors, Sprout, Package, User,
  MoreHorizontal
} from 'lucide-react';
import { useLang } from '@/lib/i18n/useLang';

const ICONS: Record<string, any> = {
  plumber: Wrench,
  electrician: Zap,
  mason: Hammer,
  carpenter: TreePine,
  mechanic: Car,
  painter: Paintbrush,
  welder: Flame,
  'construction-worker': HardHat,
  'ac-technician': Snowflake,
  'appliance-repair': WashingMachine,
  driver: Truck,
  cleaner: Sparkles,
  gardener: Flower2,
  'tile-worker': Square,
  roofer: Home,
  cook: ChefHat,
  tailor: Scissors,
  'farm-worker': Sprout,
  'delivery-worker': Package,
  'general-labourer': User,
  other: MoreHorizontal,
};

const CATEGORIES = [
  { slug: 'plumber', en: 'Plumber', hi: 'प्लंबर', ur: 'پلمبر', ks: 'پلمبر', dogri: 'प्लंबर' },
  { slug: 'electrician', en: 'Electrician', hi: 'इलेक्ट्रीशियन', ur: 'الیکٹریشن', ks: 'الیکٹریشن', dogri: 'इलेक्ट्रीशियन' },
  { slug: 'mason', en: 'Mason', hi: 'राजमिस्त्री', ur: 'راج مستری', ks: 'راج مستری', dogri: 'राज मिस्त्री' },
  { slug: 'carpenter', en: 'Carpenter', hi: 'बढ़ई', ur: 'بڑھئی', ks: 'بڑھئی', dogri: 'तरखान' },
  { slug: 'mechanic', en: 'Mechanic', hi: 'मैकेनिक', ur: 'مکینک', ks: 'مکینک', dogri: 'मैकेनिक' },
  { slug: 'painter', en: 'Painter', hi: 'पेंटर', ur: 'پینٹر', ks: 'پینٹر', dogri: 'पेंटर' },
  { slug: 'welder', en: 'Welder', hi: 'वेल्डर', ur: 'ویلڈر', ks: 'ویلڈر', dogri: 'वेल्डर' },
  { slug: 'construction-worker', en: 'Construction', hi: 'निर्माण', ur: 'تعمیراتی', ks: 'تعمیراتی', dogri: 'उसारी' },
  { slug: 'ac-technician', en: 'AC Tech', hi: 'एसी तकनीशियन', ur: 'اے سی ٹیکنیشن', ks: 'اے سی ٹیکنیشن', dogri: 'एसी टेक्नीशियन' },
  { slug: 'appliance-repair', en: 'Appliance Repair', hi: 'उपकरण मरम्मत', ur: 'آلات مرمت', ks: 'آلات مرمت', dogri: 'औजार मरम्मत' },
  { slug: 'driver', en: 'Driver', hi: 'ड्राइवर', ur: 'ڈرائیور', ks: 'ڈرائیور', dogri: 'ड्राइवर' },
  { slug: 'cleaner', en: 'Cleaner', hi: 'सफाईकर्मी', ur: 'صفائی', ks: 'صفائی', dogri: 'सफ़ाई करने आला' },
  { slug: 'gardener', en: 'Gardener', hi: 'माली', ur: 'مالی', ks: 'مالی', dogri: 'माली' },
  { slug: 'tile-worker', en: 'Tile Worker', hi: 'टाइल कारीगर', ur: 'ٹائل ورکر', ks: 'ٹائل ورکر', dogri: 'टाइल कारीगर' },
  { slug: 'roofer', en: 'Roofer', hi: 'छत बनाने वाला', ur: 'چھت ساز', ks: 'چھت ساز', dogri: 'छत बनाने आला' },
  { slug: 'cook', en: 'Cook', hi: 'रसोइया', ur: 'باورچی', ks: 'وانی', dogri: 'रसोइया' },
  { slug: 'tailor', en: 'Tailor', hi: 'दर्जी', ur: 'درزی', ks: 'درزی', dogri: 'दर्जी' },
  { slug: 'farm-worker', en: 'Farm Worker', hi: 'खेत मज़दूर', ur: 'کھیت مزدور', ks: 'کھیت مزدور', dogri: 'खेत मज़दूर' },
  { slug: 'delivery-worker', en: 'Delivery', hi: 'डिलीवरी', ur: 'ڈیلیوری', ks: 'ڈیلیوری', dogri: 'डिलीवरी' },
  { slug: 'general-labourer', en: 'General Labour', hi: 'सामान्य श्रमिक', ur: 'عام مزدور', ks: 'عام مزدور', dogri: 'आम मज़दूर' },
  { slug: 'other', en: 'Other', hi: 'अन्य', ur: 'دیگر', ks: 'باقی', dogri: 'बाक़ी' },
];

export default function CategoryGrid() {
  const { t, lang } = useLang();

  const label = (c: typeof CATEGORIES[number]) => {
    if (lang === 'hi') return c.hi;
    if (lang === 'ur') return c.ur;
    if (lang === 'ks') return c.ks;
    if (lang === 'dogri') return c.dogri;
    return c.en;
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
        {t('categories.title')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.slug] || MoreHorizontal;
          return (
            <Link
              key={c.slug}
              href={`/workers?cat=${c.slug}`}
              className="group flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-400 hover:shadow-card-hover transition text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center text-brand-600">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-800 leading-tight">
                {label(c)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
