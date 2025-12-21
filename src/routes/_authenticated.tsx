import { createFileRoute, redirect } from '@tanstack/react-router';

import { ProtectedLayout, isAuthenticated } from '@/features/auth';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: ProtectedLayout,
});
