import Container from '@/components/ui/Container';
import Link from 'next/link';

export const metadata = { title: 'FAQ — KaamConnect' };

const SECTIONS = [
  {
    title: 'Getting started',
    items: [
      { q: 'How do I create an account?', a: 'Tap Register, pick "Customer" or "Worker", fill in your name, phone, and email, and you\'re done.' },
      { q: 'Is KaamConnect free?', a: 'Yes for customers. Workers pay only a small commission on completed jobs.' },
      { q: 'Which languages are supported?', a: 'English, Hindi, Urdu, Dogri, and Kashmiri.' },
    ],
  },
  {
    title: 'Bookings & payments',
    items: [
      { q: 'How do I pay?', a: 'Through our secure Razorpay checkout. You can pay after work is confirmed.' },
      { q: 'Can I cancel?', a: 'Yes — see our Refund Policy for the exact rules.' },
      { q: 'What if I\'m not satisfied?', a: 'Raise a dispute within 48 hours and our team will review.' },
    ],
  },
  {
    title: 'Workers',
    items: [
      { q: 'How do I get verified?', a: 'Submit your ID through the worker dashboard. Our team reviews within 48 hours.' },
      { q: 'When do I get paid?', a: 'After the customer confirms completion. Payouts arrive within 3 working days.' },
      { q: 'What is the commission?', a: 'Currently 10% of the job value. This is shown before you accept any job.' },
    ],
  },
];

export default function FAQPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-500">Everything you need to know about KaamConnect.</p>
        </div>

        {SECTIONS.map((s) => (
          <section key={s.title} className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{s.title}</h2>
            <div className="space-y-3">
              {s.items.map((it, i) => (
                <details key={i} className="group bg-white border border-gray-100 rounded-2xl open:border-brand-200">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-semibold text-gray-900 pr-4">{it.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{it.a}</div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-brand-800 mb-3">Still have questions?</p>
          <Link href="/contact" className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl">
            Contact support
          </Link>
        </div>
      </div>
    </Container>
  );
}
