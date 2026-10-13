'use client';
import { Search, Users, FileCheck, CreditCard, Star, UserPlus, ClipboardList, CalendarCheck, Wallet, ThumbsUp } from 'lucide-react';
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
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
          {t('how.title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-brand-700 mb-4">{t('how.forCustomers')}</h3>
            <ol className="space-y-3">
              {CUSTOMER_STEPS.map((s, i) => (
                <li key={i} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <s.Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400">STEP {i + 1}</div>
                    <div className="text-sm text-gray-800">{pick(s)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-success-700 mb-4">{t('how.forWorkers')}</h3>
            <ol className="space-y-3">
              {WORKER_STEPS.map((s, i) => (
                <li key={i} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-success-50 text-success-600 flex items-center justify-center flex-shrink-0">
                    <s.Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400">STEP {i + 1}</div>
                    <div className="text-sm text-gray-800">{pick(s)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
