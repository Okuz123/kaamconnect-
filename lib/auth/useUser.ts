'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserRole } from '@/lib/types';

export interface AppUser extends User {
  role?: UserRole;
}

export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('primary_role')
          .eq('id', data.user.id)
          .single();
        setUser({ ...data.user, role: profile?.primary_role as UserRole | undefined });
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('primary_role')
          .eq('id', session.user.id)
          .single();
        setUser({ ...session.user, role: profile?.primary_role as UserRole | undefined });
      } else {
        setUser(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
