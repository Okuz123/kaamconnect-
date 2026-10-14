import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/dashboard/StatCard';
import { Users, Briefcase, FileText, CreditCard, AlertTriangle, MapPin, ArrowRight } from 'lucide-react';

export default async function AdminOverview() {
  const supabase = createClient();

  const [users, workers, jobs, bookings, payments, disputes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('worker_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('job_requests').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('payment_transactions').select('id', { count: 'exact', head: true }).eq('status', 'paid'),
    supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'open'),
  ]);

  const tiles = [
    { href: '/dashboard/admin/users', label: 'Users', value: users.count ?? 0, Icon: Users, tone: 'brand' as const },
    { href: '/dashboard/admin/users', label: 'Workers', value: workers.count ?? 0, Icon: Briefcase, tone: 'success' as const },
    { href: '/dashboard/admin/bookings', label: 'Job requests', value: jobs.count ?? 0, Icon: FileText, tone: 'brand' as const },
    { href: '/dashboard/admin/bookings', label: 'Bookings', value: bookings.count ?? 0, Icon: FileText, tone: 'neutral' as const },
    { href: '/dashboard/admin/payments', label: 'Paid txns', value: payments.count ?? 0, Icon: CreditCard, tone: 'success' as const },
    { href: '/dashboard/admin/disputes', label: 'Open disputes', value: disputes.count ?? 0, Icon: AlertTriangle, tone: 'amber' as const },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Admin Overview</h1>
        <p className="text-gray-500 text-sm">Live platform data from Supabase.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="group">
            <StatCard label={t.label} value={t.value} tone={t.tone} />
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/dashboard/admin/users', label: 'Manage users', desc: 'View, suspend, promote' },
          { href: '/dashboard/admin/bookings', label: 'Bookings', desc: 'Track all job requests' },
          { href: '/dashboard/admin/payments', label: 'Payments', desc: 'Transactions & refunds' },
          { href: '/dashboard/admin/locations', label: 'Locations', desc: 'Districts, blocks, villages' },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-brand-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition">
            <div className="font-bold text-gray-900 mb-1 group-hover:text-brand-600">{c.label}</div>
            <div className="text-sm text-gray-500 mb-3">{c.desc}</div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
              Open <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
