'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from '@/components/ui/Container';

const FAQS = [
  { q: 'How do I find a worker near me?', a: 'Enter your location or allow us to use your GPS, choose the skill you need, and set a search radius (1 km to 50 km). You\'ll see verified workers sorted by distance.' },
  { q: 'Is KaamConnect free for customers?', a: 'Yes. Customers can search, browse, and contact workers for free. You only pay for the work you book.' },
  { q: 'How are workers verified?', a: 'Workers submit identity documents for review. Once our team verifies them, a verification badge appears on their profile.' },
  { q: 'How does payment work?', a: 'When you accept a quotation, you pay securely through our payment gateway. The worker receives their share after job completion, minus a small platform commission.' },
  { q: 'What if I\'m not satisfied with the work?', a: 'You can raise a dispute through the booking page. Our support team reviews it and can issue a refund if warranted.' },
  { q: 'Can I register as both a worker and a customer?', a: 'Yes. You can choose the "Both" role during registration and switch dashboards anytime.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Everything you need to know about KaamConnect.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition hover:border-gray-300">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
