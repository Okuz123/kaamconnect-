import LegalPage from '@/components/legal/LegalPage';
import Link from 'next/link';
import { Mail, MessageCircle, AlertCircle } from 'lucide-react';

export const metadata = { title: 'Support Centre — KaamConnect' };

export default function SupportPage() {
  return (
    <LegalPage title="Support Centre" updated="October 2026">
      <p>Need help? We're a message away.</p>

      <div className="not-prose grid sm:grid-cols-3 gap-4 mt-8">
        {[
          { Icon: Mail, title: 'Email', desc: 'support@kaamconnect.app', sub: 'Within 24 hours' },
          { Icon: MessageCircle, title: 'WhatsApp', desc: '+91 XXXXX XXXXX', sub: 'Business hours' },
          { Icon: AlertCircle, title: 'Urgent', desc: 'safety@kaamconnect.app', sub: 'Within 4 hours' },
        ].map((c) => (
          <div key={c.title} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <c.Icon className="w-5 h-5" />
            </div>
            <div className="font-bold text-gray-900 mb-1">{c.title}</div>
            <div className="text-sm text-brand-600 break-all">{c.desc}</div>
            <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10">Common questions</h2>
      <p>See our <Link href="/faq">FAQ</Link> for answers to common questions about bookings, payments, and refunds.</p>
    </LegalPage>
  );
}
