import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const categoryId = searchParams.get('category');

  const supabase = createClient();
  let q = supabase
    .from('job_requests')
    .select('id, title, description, category_id, status, proposed_budget, created_at, lat, lng, address')
    .order('created_at', { ascending: false })
    .limit(100);

  if (status) q = q.eq('status', status);
  if (categoryId) q = q.eq('category_id', categoryId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ jobs: data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    const { data, error } = await supabase
      .from('job_requests')
      .insert(body)
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
