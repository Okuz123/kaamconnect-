import { createClient } from '@/lib/supabase/server';
import type { WorkerProfile, SkillCategory } from '@/lib/types';

export async function listSkillCategories(): Promise<SkillCategory[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('skill_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

export interface WorkerSearchParams {
  q?: string;
  categorySlug?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: 'nearest' | 'rating' | 'price' | 'experience';
}

export async function searchWorkers(params: WorkerSearchParams) {
  const supabase = createClient();

  let categoryId: string | undefined;
  if (params.categorySlug) {
    const { data: cat } = await supabase
      .from('skill_categories')
      .select('id')
      .eq('slug', params.categorySlug)
      .maybeSingle();
    categoryId = cat?.id;
  }

  let query = supabase
    .from('worker_profiles')
    .select(`
      id, user_id, public_name, bio, years_experience,
      primary_skill_id, daily_rate, hourly_rate, availability,
      preferred_radius_km, base_lat, base_lng, languages,
      verification_status, rating_avg, rating_count, total_jobs_completed,
      skill:primary_skill_id(id, slug, name_en, name_hi, name_ur, name_ks, name_dogri)
    `)
    .eq('availability', 'available')
    .limit(100);

  if (categoryId) query = query.eq('primary_skill_id', categoryId);
  if (params.q) query = query.ilike('public_name', `%${params.q}%`);

  const { data, error } = await query;
  if (error) return { workers: [] as any[], error: error.message };

  let workers = (data || []) as any[];

  // Haversine distance filter (client-side)
  if (params.lat != null && params.lng != null && params.radiusKm) {
    const R = 6371;
    const hav = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLng / 2) ** 2 *
          Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180);
      return 2 * R * Math.asin(Math.sqrt(a));
    };

    workers = workers
      .map((w) => ({
        ...w,
        distance_km:
          w.base_lat != null && w.base_lng != null
            ? hav(params.lat!, params.lng!, w.base_lat, w.base_lng)
            : null,
      }))
      .filter((w) => w.distance_km == null || w.distance_km <= params.radiusKm!);
  }

  // Sort
  switch (params.sort) {
    case 'rating':
      workers.sort((a, b) => Number(b.rating_avg) - Number(a.rating_avg));
      break;
    case 'price':
      workers.sort((a, b) => Number(a.daily_rate ?? 1e9) - Number(b.daily_rate ?? 1e9));
      break;
    case 'experience':
      workers.sort((a, b) => b.years_experience - a.years_experience);
      break;
    default:
      workers.sort((a, b) => {
        if (a.distance_km == null) return 1;
        if (b.distance_km == null) return -1;
        return a.distance_km - b.distance_km;
      });
  }

  return { workers, error: null };
}

export async function getWorkerById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('worker_profiles')
    .select(`
      *,
      skill:primary_skill_id(id, slug, name_en, name_hi, name_ur, name_ks, name_dogri),
      user:user_id(id, full_name, phone, preferred_language)
    `)
    .eq('id', id)
    .maybeSingle();
  return { worker: data, error };
}
