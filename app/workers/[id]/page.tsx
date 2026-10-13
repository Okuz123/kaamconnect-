import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkerById } from '@/lib/data/queries';
import { Star, ShieldCheck, MapPin, Phone, Briefcase, Calendar } from 'lucide-react';

export default async function WorkerDetailPage({ params }: { params: { id: string } }) {
  const { worker: w } = await getWorkerById(params.id);
  if (!w) notFound();

  const initials = (w.public_name || 'W').split(' ').map((s: string) => s[0]).slice(0, 2).join('').toUpperCase();
  const skill = w.skill?.name_en || 'Worker';
  const phone = w.user?.phone;
  const waNumber = phone ? phone.replace(/\D/g, '') : '';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/workers" className="text-sm text-brand-600 hover:underline mb-4 inline-block">← Back to workers</Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-extrabold text-2xl flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{w.public_name}</h1>
              {w.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-success-50 text-success-700 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
              {w.availability === 'available' && (
                <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded">Available now</span>
              )}
            </div>
            <div className="text-gray-600 mt-1">{skill}</div>
            {w.rating_count > 0 && (
              <div className="flex items-center gap-1 text-sm mt-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{Number(w.rating_avg).toFixed(1)}</span>
                <span className="text-gray-500">({w.rating_count} reviews)</span>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{w.years_experience} years</span>
              {w.base_lat != null && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{w.preferred_radius_km} km radius</span>}
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{w.total_jobs_completed} jobs done</span>
            </div>
          </div>

          <div className="text-right">
            {w.daily_rate != null && (
              <>
                <div className="text-2xl font-bold text-gray-900">₹{Number(w.daily_rate).toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500">per day</div>
              </>
            )}
            {w.hourly_rate != null && (
              <div className="text-sm text-gray-600 mt-1">₹{Number(w.hourly_rate).toLocaleString('en-IN')}/hr</div>
            )}
          </div>
        </div>

        {w.bio && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">About</h2>
            <p className="text-gray-700">{w.bio}</p>
          </div>
        )}

        {w.languages?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {w.languages.map((l: string) => (
                <span key={l} className="text-xs bg-gray-100 px-2.5 py-1 rounded-full">{l}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/booking/new?worker=${w.id}`}
            className="flex-1 text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg"
          >
            Request Booking
          </Link>
          {phone && (
            <>
              <a href={`tel:${phone}`} className="flex-1 text-center border border-gray-300 hover:bg-gray-50 font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Call
              </a>
              <a
                href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer"
                className="flex-1 text-center border border-green-500 text-green-700 hover:bg-green-50 font-semibold py-3 rounded-lg"
              >
                WhatsApp
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
