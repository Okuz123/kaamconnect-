import { cn } from '@/lib/utils/cn';

export default function StatCard({
  label, value, sub, tone = 'brand',
}: { label: string; value: string | number; sub?: string; tone?: 'brand' | 'success' | 'amber' | 'neutral' }) {
  const TONES = {
    brand: 'from-brand-50 to-brand-100/50 text-brand-700',
    success: 'from-success-50 to-success-100/50 text-success-700',
    amber: 'from-amber-50 to-amber-100/50 text-amber-700',
    neutral: 'from-gray-50 to-gray-100/50 text-gray-700',
  };
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition">
      <div className={cn('inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br mb-3', TONES[tone])}>
        <span className="w-2 h-2 rounded-full bg-current opacity-60" />
      </div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}
