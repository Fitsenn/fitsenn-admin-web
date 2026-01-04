import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export const getSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

// Auth guard helper (for route beforeLoad)
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return session !== null;
};
