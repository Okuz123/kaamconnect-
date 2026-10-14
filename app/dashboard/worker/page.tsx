import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/dashboard/StatCard';
import { ArrowRight, UserCircle, Wallet, Star, Briefcase } from 'lucide-react';

export default async function WorkerOverview() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: wp } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const { count: jobsCompleted } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('worker_id', wp?.id || '00000000-0000-0000-0000-000000000000')
    .eq('status', 'paid');

  if (!wp) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center mb-5">
          <UserCircle className="w-8 h-8 text-brand-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Complete your worker profile</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          You need a profile before employers can find and book you.
        </p>
        <Link href="/dashboard/worker/profile" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm">
          Create profile <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-6">Worker Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Rating" value={Number(wp.rating_avg).toFixed(1)} sub={`${wp.rating_count} reviews`} tone="amber" />
        <StatCard label="Jobs done" value={jobsCompleted ?? 0} sub="Completed & paid" tone="success" />
        <StatCard label="Experience" value={`${wp.years_experience} yrs`} tone="brand" />
        <StatCard label="Availability" value={wp.availability} sub={`${wp.preferred_radius_km} km radius`} tone="neutral" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/dashboard/worker/profile" className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-brand-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="font-bold text-gray-900 mb-1">Edit profile</div>
          <div className="text-sm text-gray-500 mb-3">Skills, rates, availability, portfolio</div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
            Open <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link href="/dashboard/worker/earnings" className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-success-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition">
          <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="font-bold text-gray-900 mb-1">Earnings</div>
          <div className="text-sm text-gray-500 mb-3">Balance and payout history</div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700">
            View <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}
