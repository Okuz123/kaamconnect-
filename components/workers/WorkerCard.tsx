'use client';
import Link from 'next/link';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import { useLang } from '@/lib/i18n/useLang';
import { formatINR, formatDistance } from '@/lib/utils/format';

export default function WorkerCard({ w }: { w: any }) {
  const { t } = useLang();
  const initials = (w.public_name || 'W').split(' ').map((s: string) => s[0]).slice(0, 2).join('').toUpperCase();
  const skill = w.skill?.name_en || 'Worker';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-card-hover hover:border-brand-400 transition">
      <div className="flex gap-3 items-start">
        <div className="w-12 h-12 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-gray-900 truncate">{w.public_name}</h3>
            {w.verification_status === 'verified' && (
              <ShieldCheck className="w-4 h-4 text-success-600" />
            )}
          </div>
          <div className="text-sm text-gray-600">{skill}</div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            {w.rating_count > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {Number(w.rating_avg).toFixed(1)} ({w.rating_count})
              </span>
            )}
            <span>{w.years_experience} yr{w.years_experience !== 1 ? 's' : ''}</span>
          </div>
          {w.distance_km != null && (
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {formatDistance(w.distance_km)}
            </div>
          )}
        </div>
        {w.daily_rate != null && (
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-semibold text-gray-900">{formatINR(w.daily_rate)}</div>
            <div className="text-xs text-gray-500">/day</div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <Link href={`/workers/${w.id}`} className="flex-1 text-center text-sm font-medium border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">
          {t('common.viewProfile')}
        </Link>
        <Link href={`/booking/new?worker=${w.id}`} className="flex-1 text-center text-sm font-medium bg-brand-600 text-white px-3 py-2 rounded-lg hover:bg-brand-700">
          {t('common.requestBooking')}
        </Link>
      </div>
    </div>
  );
}
