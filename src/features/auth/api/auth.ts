// TODO: Implement real authentication with Supabase
// For now, this is a placeholder that always returns true

export const isAuthenticated = (): boolean => {
  // In a real app, check for auth token, session, etc.
  return false;
};

export const login = async (email: string, password: string): Promise<void> => {
  // TODO: Implement Supabase login
  console.log('Login attempt:', email, password);
};

export const logout = async (): Promise<void> => {
  // TODO: Implement Supabase logout
  console.log('Logout');
};
