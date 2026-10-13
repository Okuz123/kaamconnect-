import { searchWorkers, listSkillCategories } from '@/lib/data/queries';
import WorkerCard from '@/components/workers/WorkerCard';
import WorkerFilters from '@/components/workers/WorkerFilters';

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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Workers</h1>
      <p className="text-gray-500 text-sm mb-6">
        {workers.length} worker{workers.length === 1 ? '' : 's'} found
        {lat != null && lng != null && ` within ${radiusKm} km`}
      </p>

      <WorkerFilters categories={categories} />

      {workers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <h3 className="font-semibold mb-2">No workers found</h3>
          <p className="text-sm text-gray-500">
            {lat != null ? 'Try expanding your search radius or removing filters.' : 'Try a different category or search term.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((w) => <WorkerCard key={w.id} w={w} />)}
        </div>
      )}
    </div>
  );
}
