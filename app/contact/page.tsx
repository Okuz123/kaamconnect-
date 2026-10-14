import LegalPage from '@/components/legal/LegalPage';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata = { title: 'Contact — KaamConnect' };

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us" updated="October 2026">
      <p>We're here to help. Reach out through any of the channels below and we'll respond within 24 hours.</p>

      <div className="not-prose grid sm:grid-cols-3 gap-4 mt-8">
        {[
          { Icon: Mail, label: 'Email', value: 'support@kaamconnect.app' },
          { Icon: Phone, label: 'Phone', value: '+91 XXXXX XXXXX' },
          { Icon: MapPin, label: 'Office', value: 'Anantnag, Jammu & Kashmir' },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <c.Icon className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{c.label}</div>
            <div className="text-sm font-medium text-gray-900 break-all">{c.value}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10">Grievance Officer</h2>
      <p>As per Indian IT Rules 2021, the Grievance Officer for KaamConnect is:</p>
      <ul>
        <li><strong>Name:</strong> To be appointed</li>
        <li><strong>Email:</strong> grievance@kaamconnect.app</li>
        <li><strong>Response time:</strong> 15 days</li>
      </ul>
    </LegalPage>
  );
}
