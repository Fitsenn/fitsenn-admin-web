import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginPage, isAuthenticated } from '@/features/auth';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});
