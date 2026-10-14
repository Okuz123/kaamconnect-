'use client';
import Link from 'next/link';
import { MapPin, Star, ShieldCheck, Briefcase } from 'lucide-react';
import { useLang } from '@/lib/i18n/useLang';
import { formatINR, formatDistance } from '@/lib/utils/format';
import Badge from '@/components/ui/Badge';

export default function WorkerCard({ w }: { w: any }) {
  const { t } = useLang();
  const initials = (w.public_name || 'W')
    .split(' ')
    .map((s: string) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const skill = w.skill?.name_en || 'Worker';

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-brand-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex gap-4 items-start">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
            {initials}
          </div>
          {w.availability === 'available' && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success-500 border-2 border-white" title="Available" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-gray-900 truncate">{w.public_name}</h3>
            {w.verification_status === 'verified' && (
              <ShieldCheck className="w-4 h-4 text-success-600 flex-shrink-0" />
            )}
          </div>
          <div className="text-sm font-medium text-brand-600 mb-2">{skill}</div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {w.rating_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-700">{Number(w.rating_avg).toFixed(1)}</span>
                <span>({w.rating_count})</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {w.years_experience} yr{w.years_experience !== 1 ? 's' : ''}
            </span>
          </div>

          {w.distance_km != null && (
            <div className="mt-2">
              <Badge tone="brand">
                <MapPin className="w-3 h-3" /> {formatDistance(w.distance_km)}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {w.daily_rate != null && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline justify-between">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Starting</div>
          <div>
            <span className="text-xl font-extrabold text-gray-900">{formatINR(w.daily_rate)}</span>
            <span className="text-xs text-gray-500">/day</span>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Link
          href={`/workers/${w.id}`}
          className="flex-1 text-center text-sm font-semibold border border-gray-200 text-gray-800 px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition"
        >
          {t('common.viewProfile')}
        </Link>
        <Link
          href={`/booking/new?worker=${w.id}`}
          className="flex-1 text-center text-sm font-semibold bg-brand-600 text-white px-3 py-2.5 rounded-xl hover:bg-brand-700 shadow-sm hover:shadow-md transition"
        >
          Book
        </Link>
      </div>
    </div>
  );
}
