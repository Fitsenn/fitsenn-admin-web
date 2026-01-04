import type { FunctionsHttpError } from '@supabase/supabase-js';
import type { Session, User } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User | null;
  session: Session | null;
  error: string | null;
};

type EdgeFunctionError = {
  error: string;
  message: string;
};

// Error messages mapping
const ERROR_MESSAGES: Record<string, string> = {
  NO_DASHBOARD_ACCESS: 'You do not have access to the dashboard. Please contact your administrator.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  INVALID_INPUT: 'Please provide both email and password.',
};

const getErrorMessage = async (error: FunctionsHttpError): Promise<string> => {
  try {
    const errorBody = (await error.context.json()) as EdgeFunctionError;
    const errorCode = errorBody.error;
    return ERROR_MESSAGES[errorCode] ?? errorBody.message ?? 'An unexpected error occurred';
  } catch {
    return error.message || 'An unexpected error occurred';
  }
};

const login = async ({ email, password }: LoginParams): Promise<LoginResponse> => {
  const { data, error } = await supabase.functions.invoke<{
    session: Session;
    user: User;
  }>('dashboard-login', {
    body: { email, password },
  });

  if (error) {
    return {
      user: null,
      session: null,
      error: await getErrorMessage(error as FunctionsHttpError),
    };
  }

  // Set the session in the Supabase client so auth state is updated
  if (data?.session) {
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  }

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error: null,
  };
};

const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export { login, useLogin };
