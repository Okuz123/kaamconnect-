import Link from 'next/link';
import { searchWorkers, listSkillCategories } from '@/lib/data/queries';
import WorkerCard from '@/components/workers/WorkerCard';
import WorkerFilters from '@/components/workers/WorkerFilters';
import Container from '@/components/ui/Container';
import { Users } from 'lucide-react';

export const metadata = { title: 'Find Workers — KaamConnect' };

export default async function WorkersPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const categories = await listSkillCategories();

  const lat = searchParams.lat ? Number(searchParams.lat) : undefined;
  const lng = searchParams.lng ? Number(searchParams.lng) : undefined;
  const radiusKm = searchParams.r ? Number(searchParams.r) : 3;

  const { workers } = await searchWorkers({
    q: searchParams.q,
    categorySlug: searchParams.cat,
    lat, lng, radiusKm,
    sort: (searchParams.sort as any) || 'nearest',
  });

  return (
    <Container className="py-8 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Find Workers</h1>
        <p className="text-gray-500 text-sm">
          {workers.length} worker{workers.length === 1 ? '' : 's'} found
          {lat != null && lng != null && ` within ${radiusKm} km of you`}
        </p>
      </div>

      <WorkerFilters categories={categories} />

      {workers.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 md:p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-brand-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No workers found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            {lat != null
              ? 'Try expanding your search radius or removing filters. There may not be workers in this area yet.'
              : 'Try a different category, or share KaamConnect with workers you know.'}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/workers" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50">
              Reset filters
            </Link>
            <Link href="/register?role=worker" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700">
              Invite a worker
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((w) => <WorkerCard key={w.id} w={w} />)}
        </div>
      )}
    </Container>
  );
}
