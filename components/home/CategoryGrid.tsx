'use client';
import Link from 'next/link';
import {
  Wrench, Zap, Hammer, TreePine, Car, Paintbrush, Flame, HardHat,
  Snowflake, WashingMachine, Truck, Sparkles, Flower2, Square, Home as HomeIcon,
  ChefHat, Scissors, Sprout, Package, User, MoreHorizontal, ArrowRight,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { useLang } from '@/lib/i18n/useLang';

const ICONS: Record<string, any> = {
  plumber: Wrench, electrician: Zap, mason: Hammer, carpenter: TreePine,
  mechanic: Car, painter: Paintbrush, welder: Flame, 'construction-worker': HardHat,
  'ac-technician': Snowflake, 'appliance-repair': WashingMachine, driver: Truck,
  cleaner: Sparkles, gardener: Flower2, 'tile-worker': Square, roofer: HomeIcon,
  cook: ChefHat, tailor: Scissors, 'farm-worker': Sprout, 'delivery-worker': Package,
  'general-labourer': User, other: MoreHorizontal,
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
  { slug: 'cleaner', en: 'Cleaner', hi: 'सफाईकर्मी', ur: 'صفائی', ks: 'صفائی', dogri: 'सफ़ाई' },
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
    <section className="py-16 md:py-20">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {t('categories.title')}
            </h2>
            <p className="text-gray-500 mt-2">Pick the skill you need. Find workers nearby.</p>
          </div>
          <Link href="/workers" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.slug] || MoreHorizontal;
            return (
              <Link
                key={c.slug}
                href={`/workers?cat=${c.slug}`}
                className="group flex flex-col items-center gap-2.5 p-5 bg-white border border-gray-100 rounded-2xl hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5 transition-all duration-200 text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-gray-800 leading-tight">
                  {label(c)}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
