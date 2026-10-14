import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/dashboard/StatCard';
import { ArrowRight, Search, MapPin, Calendar, Star } from 'lucide-react';

export default async function CustomerOverview() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: cp } = await supabase
    .from('customer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  let bookingsCount = 0;
  let addressesCount = 0;
  let activeCount = 0;

  if (cp) {
    const { count: b } = await supabase
      .from('bookings').select('id', { count: 'exact', head: true }).eq('customer_id', cp.id);
    bookingsCount = b ?? 0;

    const { count: a } = await supabase
      .from('customer_addresses').select('id', { count: 'exact', head: true }).eq('customer_id', cp.id);
    addressesCount = a ?? 0;

    const { count: active } = await supabase
      .from('bookings').select('id', { count: 'exact', head: true })
      .eq('customer_id', cp.id)
      .in('status', ['requested', 'accepted', 'confirmed', 'work_started', 'worker_en_route']);
    activeCount = active ?? 0;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-6">Customer Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total bookings" value={bookingsCount} tone="brand" />
        <StatCard label="Active now" value={activeCount} tone="success" />
        <StatCard label="Saved addresses" value={addressesCount} tone="neutral" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/workers" className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-brand-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Search className="w-5 h-5" />
          </div>
          <div className="font-bold text-gray-900 mb-1">Find workers</div>
          <div className="text-sm text-gray-500 mb-3">Browse nearby skilled pros</div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">Browse <ArrowRight className="w-3 h-3" /></span>
        </Link>

        <Link href="/dashboard/customer/bookings" className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-success-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition">
          <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="font-bold text-gray-900 mb-1">My bookings</div>
          <div className="text-sm text-gray-500 mb-3">Track your job requests</div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700">View <ArrowRight className="w-3 h-3" /></span>
        </Link>
      </div>
    </div>
  );
}
