'use client';
import { Search, Users, FileCheck, CreditCard, Star, UserPlus, ClipboardList, CalendarCheck, Wallet, ThumbsUp } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useLang } from '@/lib/i18n/useLang';

const CUSTOMER_STEPS = [
  { Icon: Search, en: 'Search for a skill', hi: 'सेवा खोजें', ur: 'خدمت تلاش کریں', ks: 'خدمت ژھانڈیو', dogri: 'सेवा लब्भो' },
  { Icon: Users, en: 'Find nearby workers', hi: 'आस-पास कामगार खोजें', ur: 'قریبی کارکن تلاش کریں', ks: 'نزدیٖک کام کرن والے ژھانڈیو', dogri: 'नेड़े काम करने आले लब्भो' },
  { Icon: FileCheck, en: 'Compare profiles & rates', hi: 'प्रोफ़ाइल और दरें तुलना करें', ur: 'پروفائل اور ریٹ کا موازنہ کریں', ks: 'پروفائل تہٕ ریٹ موازنہ کریو', dogri: 'प्रोफ़ाइल ते दरां दा मुक़ाबला करो' },
  { Icon: CreditCard, en: 'Submit a booking', hi: 'बुकिंग सबमिट करें', ur: 'بکنگ جمع کریں', ks: 'بکنگ جمع کریو', dogri: 'बुकिंग जमा करो' },
  { Icon: Star, en: 'Review completed job', hi: 'पूर्ण कार्य की समीक्षा करें', ur: 'مکمل کام کا جائزہ لیں', ks: 'مُکمل کام ہُنٛد جائزٕ ہیو', dogri: 'मुकम्मल कम्म दी समीक्षा करो' },
];

const WORKER_STEPS = [
  { Icon: UserPlus, en: 'Register', hi: 'रजिस्टर करें', ur: 'رجسٹر کریں', ks: 'رجسٹر کریو', dogri: 'रजिस्टर करो' },
  { Icon: ClipboardList, en: 'Create skill profile', hi: 'कौशल प्रोफ़ाइल बनाएं', ur: 'ہنر پروفائل بنائیں', ks: 'ہنر پروفائل بناوِو', dogri: 'हुनर प्रोफ़ाइल बनाओ' },
  { Icon: CalendarCheck, en: 'Set availability & rates', hi: 'उपलब्धता और दरें सेट करें', ur: 'دستیابی اور ریٹ سیٹ کریں', ks: 'دستیابی تہٕ ریٹ سیٹ کریو', dogri: 'उपलब्धता ते दरां सेट करो' },
  { Icon: Wallet, en: 'Receive job requests', hi: 'नौकरी अनुरोध प्राप्त करें', ur: 'کام کی درخواستیں وصول کریں', ks: 'کام ہٕنٛز درخواستہٕ وصول کریو', dogri: 'कम्म दियां बिनतीयां ल्यो' },
  { Icon: ThumbsUp, en: 'Complete & get paid', hi: 'पूरा करें और भुगतान पाएं', ur: 'مکمل کریں اور ادائیگی پائیں', ks: 'مُکمل کریو تہٕ ادائیگی ہیو', dogri: 'मुकम्मल करो ते पैसे ल्यो' },
];

export default function HowItWorks() {
  const { t, lang } = useLang();
  const pick = (s: any) => {
    if (lang === 'hi') return s.hi;
    if (lang === 'ur') return s.ur;
    if (lang === 'ks') return s.ks;
    if (lang === 'dogri') return s.dogri;
    return s.en;
  };

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
            {t('how.title')}
          </h2>
          <p className="text-gray-600">Simple, transparent, local.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-brand-700 mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              {t('how.forCustomers')}
            </h3>
            <ol className="space-y-3">
              {CUSTOMER_STEPS.map((s, i) => (
                <li key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-brand-50/50 transition">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="pt-1.5">
                    <div className="text-sm font-medium text-gray-800">{pick(s)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-success-700 mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-600" />
              {t('how.forWorkers')}
            </h3>
            <ol className="space-y-3">
              {WORKER_STEPS.map((s, i) => (
                <li key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-success-50/50 transition">
                  <div className="w-9 h-9 rounded-lg bg-success-50 text-success-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="pt-1.5">
                    <div className="text-sm font-medium text-gray-800">{pick(s)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
