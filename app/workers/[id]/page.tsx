import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkerById } from '@/lib/data/queries';
import { Star, ShieldCheck, MapPin, Phone, Briefcase, Calendar, CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';

export default async function WorkerDetailPage({ params }: { params: { id: string } }) {
  const { worker: w } = await getWorkerById(params.id);
  if (!w) notFound();

  const initials = (w.public_name || 'W')
    .split(' ')
    .map((s: string) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const skill = w.skill?.name_en || 'Worker';
  const phone = w.user?.phone;
  const waNumber = phone ? phone.replace(/\D/g, '') : '';

  return (
    <Container className="py-8 md:py-10">
      <Link href="/workers" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to workers
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700 flex items-center justify-center font-extrabold text-3xl flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">{w.public_name}</h1>
                  {w.verification_status === 'verified' && (
                    <Badge tone="success">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </Badge>
                  )}
                  {w.availability === 'available' && (
                    <Badge tone="success">● Available</Badge>
                  )}
                </div>
                <div className="text-base font-semibold text-brand-600 mb-3">{skill}</div>

                {w.rating_count > 0 && (
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i <= Math.round(w.rating_avg) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{Number(w.rating_avg).toFixed(1)}</span>
                    <span className="text-gray-500">({w.rating_count} reviews)</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{w.years_experience} years experience</span>
                  {w.base_lat != null && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{w.preferred_radius_km} km radius</span>}
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{w.total_jobs_completed} jobs done</span>
                </div>
              </div>
            </div>

            {w.bio && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{w.bio}</p>
              </div>
            )}

            {w.languages?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {w.languages.map((l: string) => (
                    <span key={l} className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">{l}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Trust &amp; safety</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-600" /> Profile reviewed by KaamConnect</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-600" /> Secure in-app payment</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-600" /> Dispute protection</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:sticky md:top-24">
            {w.daily_rate != null && (
              <>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Starting from</div>
                <div className="mb-5">
                  <span className="text-4xl font-extrabold text-gray-900">₹{Number(w.daily_rate).toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-500 ml-1">/day</span>
                </div>
              </>
            )}
            {w.hourly_rate != null && (
              <div className="text-sm text-gray-600 mb-5">₹{Number(w.hourly_rate).toLocaleString('en-IN')}/hour</div>
            )}

            <Link
              href={`/booking/new?worker=${w.id}`}
              className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-sm hover:shadow-md transition mb-2"
            >
              Request Booking
            </Link>

            {phone && (
              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${phone}`} className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 font-semibold py-3 rounded-xl text-sm transition">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 border border-green-200 text-green-700 hover:bg-green-50 font-semibold py-3 rounded-xl text-sm transition"
                >
                  <MessageCircle className="w-4 h-4" /> Chat
                </a>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4 text-center">
              Free to request. Pay only after work is confirmed.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
